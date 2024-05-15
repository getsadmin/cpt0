const mongoose = require("mongoose");

// Define password schema
const passwordSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{6}$/.test(v); // Validate that OTP is a 6-digit number
            },
            message: props => `${props.value} is not a valid OTP!`
        }
    },
    otpExpiry: {
        type: Date,
        required: true,
        default: function() {
            // Set OTP expiry time to 5 minutes from the current time
            return new Date(Date.now() + 5 * 60 * 1000);
        }
    }
});

// Create and export Password model
module.exports = mongoose.model("Password", passwordSchema);
