import rowErrorController from '../controllers/rowErrorController.js'
import rowErrorRepository from '../../application/repositories/rowErrorRepository.js';
import rowErrorRepositoryDB from '../../database/repositories/rowErrorRepositoryDB.js';

const rowErrorControllerInstance = rowErrorController(
    rowErrorRepository,
    rowErrorRepositoryDB
);

export default rowErrorControllerInstance;
