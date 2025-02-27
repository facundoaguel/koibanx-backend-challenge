import rowDataRepository from '../../application/repositories/rowDataRepository.js';
import rowDataRepositoryDB from '../../database/repositories/rowDataRepositoryDB.js';
import rowDataController from '../controllers/rowDataController.js'

const rowDataControllerInstance = rowDataController(
    rowDataRepository,
    rowDataRepositoryDB
);

export default rowDataControllerInstance;
