// models/invoice.js

const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema ({
 
    billto: String,
    customerID: String,
    date: Date,
    terms: String,
    invoiceNumber: String,
    poNo: String,
    poDate: Date,
    quoteRef: String,
    projectID: String,
    hsnCode: String,
    workingDate: String
  
  });

module.exports = mongoose.model("Invoice", invoiceSchema);