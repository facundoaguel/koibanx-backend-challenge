const path = require('path');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
require('dotenv').config();

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
    ];
    const allowedExtensions = ['.xlsx', '.xls'];

    if (
        allowedMimeTypes.includes(file.mimetype) &&
        allowedExtensions.includes(path.extname(file.originalname).toLowerCase())
    ) {
        return cb(null, true);
    } else {
        return cb(new Error('Solo se permiten archivos .xlsx o .xls'));
    }
};

//usamos GridFS para poder almacenar archivos grandes en mongo, en esquemas normales el max es 16mb
const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    options: { useUnifiedTopology: true },
    file: (req, file) => {
        return {
            filename: file.originalname,
            bucketName: 'uploads', //bucket GridFS
        };
    },
});

const upload = multer({ storage, fileFilter });

module.exports = upload;
