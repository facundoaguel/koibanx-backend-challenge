const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerConfig');
const { getGfs } = require('../config/database');
const mongoose = require('mongoose');
const ExcelSchema = require('../models/Excel');
const ValidDataSchema = require('../models/validData');
const ErrorDataSchema = require('../models/Errors');
const { processFile } = require('../services/excelService')

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file was uploaded' });
        }

        const taskId = new mongoose.Types.ObjectId();
        await ExcelSchema.create({ taskId, status: 'pending', errorsList: []});

        processFile(taskId, req.file.id)
            .then(() => console.log(`Task ${taskId} completed`))
            .catch((err) => console.error(`Task ${taskId} failed`, err));

        res.status(202).json({ message: 'File is being processed', taskId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//devuelve toda la info del archivo
router.get('/:fileId', async (req, res) => {
    const { fileId } = req.params;
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 100; 

    try {
        const task = await ExcelSchema.findOne({ taskId: fileId });

        if (!task) {
            return res.status(404).json({ error: 'File not found' });
        }

        const lowerBound = limit * (page - 1);
        const upperBound = limit * page;

        const processedData = await ValidDataSchema.find({
            taskId: fileId,
            row: { $gte: lowerBound + 1, $lt: upperBound + 1 }
        })
        .select('name age nums row -_id')
        .sort({ row: 1 })
        .limit(limit);

        const errors = await ErrorDataSchema.find({
            taskId: fileId, 
            row: { $gte: lowerBound + 1, $lt: upperBound + 1 }
        })
        .select('errorsList -_id') 
        .sort({ row: 1 })
        .limit(limit);

        const mergedErrors = errors.flatMap(error => error.errorsList);
        const rows = task.totalRows

        res.status(200).json({
            taskId: task.taskId,
            status: task.status,
            totalRows: rows,
            data: processedData,
            errors: mergedErrors,
            currentPage: page,
            totalPages: Math.ceil(rows / limit),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//endpoint para chequear si se guardaban bien los archivos en gfs
router.get('/', async (req, res) => {
    try {
        const gfs = getGfs();
        const files = await gfs.files.find().toArray();
        if (!files || files.length === 0) {
            return res.status(404).json({ error: 'No files exist' });
        }
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//obtener la informacion valida de un archivo
router.get('/data/:fileId', async (req, res) => {
    const { fileId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100; 

    try {
        const task = await ExcelSchema.findOne({ taskId: fileId });

        if (!task) {
            return res.status(404).json({ error: 'File not found' });
        }

        const lowerBound = limit * (page - 1);
        const upperBound = limit * page;

        const processedData = await ValidDataSchema.find({
            taskId: fileId,
            row: { $gte: lowerBound + 1, $lt: upperBound + 1 }
        })
        .select('name age nums row -_id')
        .sort({ row: 1 })
        .limit(limit);

        const totalRows = task.totalRows;

        res.status(200).json({
            taskId: task.taskId,
            status: task.status,
            data: processedData,
            currentPage: page,
            totalPages: Math.ceil(totalRows / limit),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// endpoint para obtener solo los errores
router.get('/errors/:fileId', async (req, res) => {
    const { fileId } = req.params;
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 100; 

    try {
        const task = await ExcelSchema.findOne({ taskId: fileId });

        if (!task) {
            return res.status(404).json({ error: 'File not found' });
        }

        const lowerBound = limit * (page - 1);
        const upperBound = limit * page;

        const errors = await ErrorDataSchema.find({
            taskId: fileId,
            row: { $gte: lowerBound + 1, $lt: upperBound + 1 }
        })
        .select('errorsList -_id')
        .sort({ row: 1 })
        .limit(limit);

        const mergedErrors = errors.flatMap(error => error.errorsList);
        const totalErrors = await ErrorDataSchema.countDocuments({ taskId: fileId });

        res.status(200).json({
            taskId: task.taskId,
            status: task.status,
            errors: mergedErrors,
            currentPage: page,
            totalPages: Math.ceil(totalErrors / limit),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
