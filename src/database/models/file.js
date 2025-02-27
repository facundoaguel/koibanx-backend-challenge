import mongoose from 'mongoose'

const FileSchema = new mongoose.Schema({
    fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: { type: String, enum: ['pending', 'processing', 'done'], default: 'pending' },
    totalRows: {type: Number},
    createdAt: { type: Date, default: Date.now }
});

const FileModel = mongoose.model('File', FileSchema);

export default FileModel
