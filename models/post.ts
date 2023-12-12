const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  id: String,
  nama: String,
  desc: String,
  imgLink: String,
});

module.exports = {
  mainModel: model("SG", postSchema),
};
