var _a = require("mongoose"), Schema = _a.Schema, model = _a.model;
var postSchema = new Schema({
    id: String,
    nama: String,
    desc: String,
    imgLink: String,
});
module.exports = {
    mainModel: model("SG", postSchema),
};
