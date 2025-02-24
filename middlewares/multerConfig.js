// const multer = require('multer');
const path = require('path');
// require('dotenv').config();
// const { GridFsStorage } = require('multer-gridfs-storage');

// // Configuración del almacenamiento de GridFS
// const storage = new GridFsStorage({
//     url: process.env.MONGO_URI,
//     options: { useUnifiedTopology: true }, // Asegúrate de incluir esta opción
//     file: (req, file) => {
//         return new Promise((resolve, reject) => {
//             const filename = file.originalname;

//             // Verificar el tipo de archivo antes de guardarlo
//             const fileInfo = {
//                 filename: filename,
//                 bucketName: 'uploads', // El nombre del bucket en GridFS
//             };

//             // Resuelve el archivo
//             resolve(fileInfo);
//         });
//     },
// });

// // Filtro para aceptar solo archivos Excel
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

// // Crear el middleware de multer
// const upload = multer({ storage, fileFilter });

// module.exports = upload;
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
require('dotenv').config();

// Configuración del almacenamiento de GridFS
const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    options: { useUnifiedTopology: true },
    file: (req, file) => {
        return {
            filename: file.originalname,
            bucketName: 'uploads', // El nombre del bucket en GridFS
        };
    },
});

// Crear el middleware de multer
const upload = multer({ storage, fileFilter });

module.exports = upload;
