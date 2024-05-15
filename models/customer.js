// CustomerData schema
const mongoose = require("mongoose");
const customerDataSchema = new mongoose.Schema({
  CustomerAddress: String,
  BranchAddress: String,
  CustomerId: String,
  CustomerName: String,
  GST: String
  
});

module.exports = mongoose.model("CustomerData", customerDataSchema);