
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import mongoose from 'mongoose';

import upload from '../handlers/multer.js';
import fileControllerInstance from '../adapters/instances/fileControllerInstance.js';
import rowDataControllerInstance from '../adapters/instances/rowDataControllerInstance.js';
import rowErrorControllerInstance from '../adapters/instances/rowErrorControllerInstance.js';
import startWorker from '../threading/startWorker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function fileRouter() {
  const router = express.Router();

  router.post('/upload', async (req, res) => {
    upload.single('file')(req, res, async (err) => {
      if (err) return res.status(400).json({ error: err.message });
    
      if (!req.file) return res.status(400).json({ error: 'File is required' });


      try {
        const fileName = req.file.originalname
        const fileData = await fileControllerInstance.addNewFile(req.file);

          setTimeout(() => {
            const objectId = req.file.id;
            const fileId = objectId.toString();
            const workerPath = path.join(__dirname, '../threading/fileWorker.js');

            startWorker(workerPath, { fileId })
              .then(() => console.log('Processing started for file:', fileId))
              .catch((error) => console.error('Error starting worker:', error));
        }, 1000);

        return res.json({
          fileId: fileData.fileId,
          status: fileData.status,
          message: `File ${fileName} is uploading.`,
        });

        

      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    });
  });

  router.get('/:fileId', async (req, res) => {
    const fileId = req.params.fileId;

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ error: 'Invalid file ID format' });
    }

    try {
      const file = await fileControllerInstance.fetchFileById(fileId);

      if (!file) {
        return res.status(404).json({ error: "File doesn't exist" });
      }

      const params = {
             fileId,
             page: parseInt(req.query.page),
             perPage: parseInt(req.query.perPage)
      }

      const validData = await rowDataControllerInstance.findAllData(params);
      const errors = await rowErrorControllerInstance.findAllData(params);

      return res.json({
        fileId: file.fileId,
        status: file.status,
        totalRows: file.totalRows,
        validData,
        errors,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.get('/', (req, res) => {
    res.send('FILES');
  });

  return router;
}
