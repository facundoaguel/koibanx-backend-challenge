const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerConfig');
const { getGfs } = require('../config/database');
const mongoose = require('mongoose');
const ExcelSchema = require('../models/Excel');
const ValidDataSchema = require('../models/validData');
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

router.get('/data/:fileId', async (req, res) => {
    const { fileId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    try {
        const task = await ExcelSchema.findOne({ taskId: fileId });

        if (!task) {
            return res.status(404).json({ error: 'File not found' });
        }

        const processedData = await ValidDataSchema.find({ taskId: fileId })
            .select('name age nums -_id')
            .skip((page - 1) * limit)
            .limit(limit);

        const totalData = await ValidDataSchema.countDocuments({ taskId: fileId });

        res.status(200).json({
            taskId: task.taskId,
            status: task.status,
            totalData,
            processedData,
            currentPage: page,
            totalPages: Math.ceil(totalData / limit),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/errors/:fileId', async (req, res) => {
    const { fileId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    try {
        const task = await ExcelSchema.findOne({ taskId: fileId });

        if (!task) {
            return res.status(404).json({ error: 'File not found' });
        }

        const errors = task.errorsList;
        const totalErrors = errors.length;
        const paginatedErrors = errors.slice((page - 1) * limit, page * limit);

        res.status(200).json({
            taskId: task.taskId,
            status: task.status,
            totalErrors,
            errors: paginatedErrors,
            currentPage: page,
            totalPages: Math.ceil(totalErrors / limit),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/:fileId', async (req, res) => {
    const { fileId } = req.params;
    const { page = 1, limit = 100 } = req.query;

    try {
        const task = await ExcelSchema.findOne({ taskId: fileId });

        if (!task) {
            return res.status(404).json({ error: 'File not found' });
        }

        const lowerBound = limit * (page - 1);
        const upperBound = limit * page;

        // Obtener solo las filas válidas dentro del rango
        const processedData = await ValidDataSchema.find({
            taskId: fileId,
            row: { $gt: lowerBound, $lte: upperBound } // Filtrar por el rango de filas
        })
        .select('name age nums row -_id')
        .sort({ row: 1 });

        // Filtrar errores dentro del rango solicitado
        const errors = task.errorsList
            .filter(error => error.row > lowerBound && error.row <= upperBound)
            .sort((a, b) => a.row - b.row);

        const rows = task.totalRows

        res.status(200).json({
            taskId: task.taskId,
            status: task.status,
            totalRows: rows,
            data: processedData,
            errors: errors,
            currentPage: page,
            totalPages: Math.ceil(rows / limit),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




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

module.exports = router;
