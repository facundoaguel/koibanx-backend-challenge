const mongoose = require('mongoose');


const ErrorDataSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    row: Number,
    errorsList: { type: Array, default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Error', ErrorDataSchema);