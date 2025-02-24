const XLSX = require('xlsx');
const ExcelSchema = require('../models/Excel')
const ValidDataSchema = require('../models/validData');
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
        let buffer = Buffer.from([]);
    
        return new Promise((resolve, reject) => {
            readStream.on('data', (chunk) => {
                buffer = Buffer.concat([buffer, chunk]);
            });
    
            readStream.on('end', async () => {
                try {
                    const workbook = XLSX.read(buffer, { type: 'buffer' });
                    const errors = [];
                    const validData = [];
                    let totalRows = 1;

                    for (const sheetName of workbook.SheetNames) {
                        const worksheet = workbook.Sheets[sheetName];
                        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                        await Promise.all(
                            rows.slice(1).map(async (row, index) => {
                                const rowIndex = index + 2; // Adjust for header row
                                const { hasError, errors: rowErrors } = validateRow(row, rowIndex);
    
                                if (hasError) {
                                    errors.push(...rowErrors);
                                } else {
                                    const numsArray = row[2]
                                        .split(',')
                                        .map(num => parseInt(num, 10))
                                        .filter(n => !isNaN(n))
                                        .sort();
                                        validData.push({
                                            taskId,
                                            row: rowIndex,
                                            name: row[0],   
                                            age: row[1],    
                                            nums: numsArray  
                                        });
                                }
                                totalRows++;
                            })
                        );
                    }
    
                    if (validData.length > 0){
                        await ValidDataSchema.insertMany(validData);
                    }
                    await ExcelSchema.findOneAndUpdate(
                        { taskId },
                        { 
                            $set: { 
                                status: 'done', 
                                errorsList: errors,
                                totalRows: totalRows // Asegúrate de incluir el total de filas aquí
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
