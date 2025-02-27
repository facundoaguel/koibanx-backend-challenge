import path from 'path';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import dotenv from 'dotenv';

dotenv.config();

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
    return cb(new Error('Only .xlsx or .xls files'));
  }
};

// Usamos GridFS para almacenar archivos grandes en MongoDB
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  options: { useUnifiedTopology: true },
  file: (req, file) => ({
    filename: file.originalname,
    bucketName: 'uploads', // Bucket en GridFS
  }),
});

const upload = multer({ storage, fileFilter });

export default upload;
