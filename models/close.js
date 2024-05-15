// close.js

const mongoose = require("mongoose");

const closeSchema = new mongoose.Schema({
  ProjectID : String,
  comments: String
});

const CloseModel = mongoose.model("closure", closeSchema);

module.exports = CloseModel;
