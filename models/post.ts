const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  id: String,
  nama: String,
  desc: String,
  imgLink: String,
  comments: [
    {
      isi: String,
    },
  ],
});

module.exports = {
  mainModel: model("SG", postSchema),
};
