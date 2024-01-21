import { Express, Request, Response } from "express";
const multer = require("multer");
const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const ImageKit = require("imagekit");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { mainModel } = require("./models/post");
const axios = require("axios");
dotenv.config();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

var imagekit = new ImageKit({
  publicKey: process.env.publicImg,
  privateKey: process.env.privateImg,
  urlEndpoint: process.env.urlEndpoint,
});

interface comment {
  isi: string;
}

interface Data {
  id: number;
  nama: string;
  desc: string;
  imgLink: string;
  comments: comment[];
}

var data: Data[];

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.post("/", upload.single("image"), async (req: Request, res: Response) => {
  const token = req.body["g-recaptcha-response"];
  const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_RECAPTCHA_SECRET_KEY}&response=${token}`
  );
  if (!response.data.success) return res.json({ msg: "reCAPTCHA tidak valid" });

  // TODO: Sesuaikan dengan data yang diunggah dari penyimpanan memori
  const desc = req.body.desc;
  const nama = req.body.nama;
  const id = data.length + 1;
  let imgLink;
  // Misalnya, untuk mengakses buffer dari file yang diunggah
  if (req.file) {
    const buffer = req.file.buffer;
    await imagekit.upload(
      {
        file: buffer,
        fileName: `image-${id}.jpg`,
        useUniqueFileName: false,
        folder: "SG",
      },
      async function (error: any, result: any) {
        if (error) {
          console.error("Error uploading to ImageKit:", error);
          return res
            .status(500)
            .json({ msg: "Terjadi kesalahan saat mengunggah file" });
        }

        imgLink = result.url;
      }
    );
  } else if (req.body.link) {
    imgLink = req.body.link;
  }
  const comments: comment[] = [];
  // Simpan ke basis data atau lakukan tindakan lainnya
  await mainModel.create({
    id,
    nama,
    desc,
    imgLink,
    comments,
  });

  data.unshift({ id, nama, desc, imgLink, comments });
  res.redirect("/" + id);
});

app.post("/:id/comment", async (req: Request, res: Response) => {
  const entryId = parseInt(req.params.id);
  const comment = req.body.comment;

  const entry = data.find((item) => item.id == entryId);

  if (!entry) {
    return res.status(404).json({ msg: "gak ada" });
  }

  entry.comments.push({ isi: comment });

  await mainModel.findOneAndUpdate(
    {
      id: entryId,
    },
    { $push: { comments: { isi: comment } } }
  );

  return res.redirect(`/${entry.id}`);
});
mongoose.set("strict", false);
mongoose
  .connect(process.env.MONGODBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    mainModel
      .updateMany(
        { $or: [{ comments: { $exists: false } }, { comments: { $size: 0 } }] },
        { $set: { comments: [] } },
        { upsert: true } // Menambahkan dokumen baru jika tidak ditemukan
      )
      .then((updateResult: any) => {
        console.log(`${updateResult.modifiedCount} dokumen diperbarui`);

        // Setelah updateMany selesai, ambil data terbaru dari database
        return mainModel.find({});
      })
      .then((res: any) => {
        // Proses data dan tambahkan array kosong jika 'comments' tidak ada atau kosong
        data = res.map((item: any) => {
          // Pemeriksaan tambahan untuk memeriksa apakah kata "gay" ada dalam data
          if (!item.comments || item.comments.length === 0) {
            item.comments = [];
          }

          // Pemeriksaan apakah kata "gay" ada dalam data
          if (
            !item.nama ||
            !item.nama.includes("gay") ||
            !item.desc ||
            !item.desc.includes("gay")
          ) {
            return item;
          }

          return null; // Jika kata "gay" ada, kembalikan null
        });
        // Lanjutkan dengan logika atau tindakan selanjutnya di sini
        app.get("/", (req: Request, res: Response) => {
          res.render("index", {
            data: data,
          }); // Render the "index.ejs" file in the "views" directory
        });
        app.get("/search", function (req: Request, res: Response) {
          const searchTerm: any = req.query.term; // Dapatkan input pengguna
          const searchResults = data.filter(
            (item) =>
              item.nama &&
              item.nama.toLowerCase().includes(searchTerm.toLowerCase() || "") // Cek keberadaan item.nama sebelum menggunakan includes
          );
          res.render("index", {
            data: searchResults,
          });
        });
        app.get("/:id", function (req: Request, res: Response) {
          const searchTerm: number = parseInt(req.params.id); // Dapatkan ID dari URL dan ubah ke tipe numerik jika perlu
          console.log(searchTerm);
          const searchResult = data.find((entry) => entry.id == searchTerm);

          res.render("img", {
            data: data,
            entry: searchResult,
          });
        });

        app.listen(port, () => {
          console.log(`[app]: app is running at http://localhost:${port}`);
        });
      });
  });
