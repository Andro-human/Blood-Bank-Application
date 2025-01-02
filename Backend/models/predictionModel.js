const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
    BloodType: {
        type: String,
        required: [true, "blood group is required"],
        enum: ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"],
    },
    index: {
        type: Number,
        required: [true, "password is required"],
    },
    value: {
        type: Number,
    },
    predictionType: {
        type: String,
        required: [true, "address is required"],
    }
});

module.exports =  mongoose.model('prediction', PredictionSchema);