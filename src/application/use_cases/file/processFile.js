import file from '../../../entitites/file.js';
import update from './update.js'
import addRowData from '../rowData/add.js'
import addRowError from  '../rowError/add.js'
import fileAdapter from '../../../handlers/fileAdapter.js'
import validateRow from '../../../utils/validateRow.js'
import insertManyData from '../rowData/insertMany.js'
import insertManyError from '../rowError/insertMany.js'

export default async function processFile(fileId, fileRepository, rowErrorRepository, rowDataRepository) {
        console.log(`Processing file ${fileId}`);


        await update(fileId, {status: 'processing'}, fileRepository)
        let totalRows = 1;
        let batchErrors = [];
        let batchValidData = [];


        try {
            const adapter = fileAdapter()
            const sheets = await adapter.readFile(fileId);

            for (const { sheetName, rows } of sheets) {
                for (let index = 1; index < rows.length; index++) {
                    const row = rows[index];
                    const rowIndex = index + 1;

                    if (row.every(cell => cell === "")) continue;

                    const { hasError, errors: rowErrors } = validateRow(row, rowIndex);
                    

                    if (hasError) {
                        batchErrors.push({ fileId, row: rowIndex, cols: rowErrors });
                    } else {
                        batchValidData.push({
                            fileId,
                            row: rowIndex,
                            name: row[0]?.toString().trim(),
                            age: parseInt(row[1], 10),
                            nums: row[2].split(',').map(num => parseInt(num.trim(), 10)).filter(n => !isNaN(n)).sort()
                        });
                    }

                    totalRows++;

                    if (batchErrors.length >= 1000) {
                        insertManyError(batchErrors, rowErrorRepository)
                        batchErrors = [];
                    }
                    if (batchValidData.length >= 1000) {
                        insertManyData(batchValidData, rowDataRepository)
                        batchValidData = [];
                    }
                }
            }

            insertManyError(batchErrors, rowErrorRepository)
            insertManyData(batchValidData, rowDataRepository)
            update(fileId, {status: 'done', totalRows}, fileRepository)

        } catch (error) {
            console.error("Error processing file:", error);
        }
};