import mongoose from 'mongoose'


const RowErrorSchema = new mongoose.Schema({
    fileId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    row: Number,
    cols: { type: Array, default: [] },
}, { timestamps: true });


const RowErrorModel =  mongoose.model('RowError', RowErrorSchema);
export default RowErrorModel