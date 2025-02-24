const mongoose = require('mongoose');


const ValidDataSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    row: Number,
    name: { type: String, required: true },
    age: { type: Number, required: true },
    nums: { type: [Number], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('validData', ValidDataSchema);