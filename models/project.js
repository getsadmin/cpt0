const mongoose = require("mongoose");
const projectDataSchema = new mongoose.Schema({
  title: String,
  quoteRef: String,
  projectID: String,
  shortTitle: String,
  shortCustomerName: String,
  customerID: String
});

module.exports= mongoose.model("ProjectData", projectDataSchema);