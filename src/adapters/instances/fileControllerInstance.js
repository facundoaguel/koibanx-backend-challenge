import fileController from '../../adapters/controllers/fileController.js';
import fileRepository from '../../application/repositories/fileRepository.js';
import fileRepositoryDB from '../../database/repositories/fileRepositoryDB.js';

import rowDataRepository from '../../application/repositories/rowDataRepository.js';
import rowDataRepositoryDB from '../../database/repositories/rowDataRepositoryDB.js';

import rowErrorRepository from '../../application/repositories/rowErrorRepository.js';
import rowErrorRepositoryDB from '../../database/repositories/rowErrorRepositoryDB.js';

const fileControllerInstance = fileController(
    fileRepository,
    fileRepositoryDB,
    rowErrorRepository,
    rowErrorRepositoryDB,
    rowDataRepository,
    rowDataRepositoryDB
);

export default fileControllerInstance;
