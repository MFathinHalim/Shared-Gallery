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

interface Data {
  id: number;
  nama: string;
  desc: string;
  imgLink: string;
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

        const imgLink = result.url;

        // Lakukan apa pun yang perlu dilakukan setelah berhasil mengunggah ke ImageKit
        console.log("Berhasil mengunggah ke ImageKit:", imgLink);

        // Simpan ke basis data atau lakukan tindakan lainnya
        await mainModel.create({
          id,
          nama,
          desc,
          imgLink,
        });

        data.unshift({ id, nama, desc, imgLink });
        res.redirect("/" + id);
      }
    );
  }
});

mongoose
  .connect(process.env.MONGODBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    mainModel.find({}, null).then((res: Data[]) => {
      data = res;
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
          entry: searchResult,
        });
      });

      app.listen(port, () => {
        console.log(`[app]: app is running at http://localhost:${port}`);
      });
    });
  });
