const mongoose = require('mongoose');

const ExcelSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: { type: String, enum: ['pending', 'processing', 'done'], default: 'pending' },
    totalRows: {type: Number},
    errorsList: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now }
});



module.exports = mongoose.model('Excel', ExcelSchema);
