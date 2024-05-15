const mongoose = require("mongoose");

const companyDataSchema = new mongoose.Schema({
    CustomerAddress: String,
    BranchAddress: String,
    CustomerID: String,
    CustomerName: String,
    Statecode: Number,
    GST: String,
    DateValidity: Date,
    ARNNo: Number
});

module.exports = mongoose.model("CompanyData", companyDataSchema);
