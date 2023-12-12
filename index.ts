import { Express, Request, Response } from "express";
const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const ImageKit = require("imagekit");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { mainModel } = require("./models/post");
const axios = require("axios");
dotenv.config();

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
const storage = multer.diskStorage({
  destination: function (req: Request, file: any, cb: any) {
    cb(null, `public/images/uploads`);
  },
  filename: function (req: Request, file: any, cb: any) {
    cb(null, `image-${data.length + 1}.jpg`);
  },
});
const upload = multer({ storage });

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views"); // Specify the directory where your views are located
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
  //TODO first things, we will make the const variable from the req data
  const desc = req.body.desc;
  const nama = req.body.nama;
  const id = data.length + 1;
  const imgLink = `https://ik.imagekit.io/9hpbqscxd/SG/image-${id}.jpg`;
  fs.readFile(
    path.join(__dirname, "/public/images/uploads", "image-" + id + ".jpg"),
    async function (err: any, data: any) {
      if (err) throw err; // Fail if the file can't be read.
      await imagekit.upload(
        {
          file: data, //required
          fileName: "image-" + id + ".jpg", //required
          useUniqueFileName: false,
          folder: "SG",
        },
        function (error: any, result: any) {
          if (error) console.log(error);
        }
      );
    }
  );
  await mainModel.create({
    id,
    nama,
    desc,
    imgLink,
  });
  data.unshift({ id, nama, desc, imgLink });
  res.redirect("/" + id);
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
          (item) => item.nama && item.nama.includes(searchTerm || "") // Cek keberadaan item.nama sebelum menggunakan includes
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
