import mongoose from 'mongoose'

const RowDataSchema = new mongoose.Schema({
    fileId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    row: Number,
    name: { type: String, required: true },
    age: { type: Number, required: true },
    nums: { type: [Number], default: [] }
}, { timestamps: true });


const RowDataModel = mongoose.model('RowData', RowDataSchema);

export default RowDataModel