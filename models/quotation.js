const mongoose = require("mongoose");

const quotationSchema = new mongoose.Schema({
    // Define schema fields here, adjust as needed based on your frontend form
    to: String,
    customerID: String,
    projectID: String,
    attn: String,
    custRef: String,
    address: String,
    deliverySchedule: Number,
    paymentTerms: String,
    quoteRef: String,
    date: Date,
    priceValidity: Number,
    expiryDate: Date,
    offeredCost: Number,
    IGST: Number,
    totalValue: Number
  });
  
  module.exports = mongoose.model("Quotation", quotationSchema);
  