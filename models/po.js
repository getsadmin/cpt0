// po schema

const mongoose = require('mongoose');

const poSchema = new mongoose.Schema({
    poNumber: String,
    poDate: Date,
    poHSNCode: String,
    imageUpload: {
        filename:String,
        data: Buffer,
        contentType: String
    }
});
module.exports = mongoose.model("PO", poSchema);