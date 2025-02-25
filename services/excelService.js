const XLSX = require('xlsx');
const ExcelSchema = require('../models/Excel')
const ValidDataSchema = require('../models/validData');
const ErrorDataSchema = require('../models/Errors');
let { getGfs } = require('../config/database')

const excelToJson = (filePath) => {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; //primera hoja del excel
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    return sheetData;
};

const validateRow = (row, rowIndex) => {
    const errors = [];
    const name = row[0]; 
    const age = row[1]; 
    const nums = row[2]; 

    //validacion
    if (!name || typeof name !== 'string') {
        errors.push({ row: rowIndex, col: 1});
    }
    if (!age || isNaN(age)) {
        errors.push({ row: rowIndex, col: 2});
    }
    if (!nums || typeof nums !== 'string') {
        errors.push({ row: rowIndex, col: 3});
    } else {
        const numsArray = nums.split(',').map(num => parseInt(num, 10)).filter(n => !isNaN(n));
        if (numsArray.length === 0) {
            errors.push({ row: rowIndex, col: 3});
        }
    }

    return { hasError: errors.length > 0, errors };
};


const processFile = async (taskId, fileId) => {
    const gfs = getGfs();
    const readStream = gfs.createReadStream({ _id: fileId });

    let totalRows = 1; //arranca en 1 por la cabecera
    let batchErrors = [];
    let batchValidData = [];

    console.log(`Processing file ${taskId}`)

    await ExcelSchema.findOneAndUpdate(
        { taskId },
        { 
            $set: { 
                status: 'processing', 
            }
        }
    );

    return new Promise((resolve, reject) => {
        const chunks = [];
        
        readStream.on('data', (chunk) => {
            chunks.push(chunk);
        });

        readStream.on('end', async () => {
            try {
                const buffer = Buffer.concat(chunks);
                const workbook = XLSX.read(buffer, { type: 'buffer' });

                for (const sheetName of workbook.SheetNames) {
                    const worksheet = workbook.Sheets[sheetName];
                    
                    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
                    
                    for (let index = 1; index < rows.length; index++) {
                        const row = rows[index];
                        const rowIndex = index + 1;

                        if (row.every(cell => cell === "")) continue;

                        const { hasError, errors: rowErrors } = validateRow(row, rowIndex);

                        if (hasError) {
                            batchErrors.push({ taskId, row: rowIndex, errorsList: rowErrors });
                        } else {
                            batchValidData.push({
                                taskId,
                                row: rowIndex,
                                name: row[0]?.toString().trim(),
                                age: parseInt(row[1], 10),
                                nums: row[2].split(',').map(num => parseInt(num.trim(), 10)).filter(n => !isNaN(n)).sort()
                            });
                        }

                        totalRows++;
                        if (batchErrors.length >= 1000) {
                            await ErrorDataSchema.insertMany(batchErrors);
                            batchErrors = [];
                        }
                        if (batchValidData.length >= 1000) {
                            await ValidDataSchema.insertMany(batchValidData);
                            batchValidData = [];
                        }
                    }
                }
                if (batchErrors.length > 0) await ErrorDataSchema.insertMany(batchErrors);
                if (batchValidData.length > 0) await ValidDataSchema.insertMany(batchValidData);

                await ExcelSchema.findOneAndUpdate(
                    { taskId },
                    { 
                        $set: { 
                            status: 'done', 
                            totalRows 
                        }
                    }
                );

                resolve();
            } catch (err) {
                reject(err);
            }
        });

        readStream.on('error', (err) => {
            reject(err);
        });
    });
};

module.exports = { excelToJson, processFile };
