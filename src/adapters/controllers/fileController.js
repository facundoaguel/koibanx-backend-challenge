import addFile from '../../application/use_cases/file/add.js';
import findById from '../../application/use_cases/file/findById.js';
import processFile from '../../application/use_cases/file/processFile.js';
import updateFile from '../../application/use_cases/file/update.js';

export default function fileController(
  fileRepository,
  fileRepositoryImpl,
  rowErrorRepository,
  rowErrorRepositoryImpl,
  rowDataRepository,
  rowDataRepositoryImpl
) {
  const dbRepository = fileRepository(fileRepositoryImpl());
  const errorRepository = rowErrorRepository(rowErrorRepositoryImpl());
  const dataRepository = rowDataRepository(rowDataRepositoryImpl());

  const fetchFileById = async (fileId) => {
    if (!fileId) throw new Error('File ID is required');
    return await findById(fileId, dbRepository);
  };

  const process = async (fileId) => {
    if (!fileId) throw new Error('File ID is required');
    return await processFile(fileId, dbRepository, errorRepository, dataRepository);
  };

  const update = async (fileId, data) => {
    if (!fileId || !data) throw new Error('File ID and data are required');
    return await updateFile(fileId, data, dbRepository);
  };

  const addNewFile = async (file) => {
    if (!file) throw new Error('No file was uploaded');

    const fileId = file.id;
    console.log(`Uploading file ${file.originalname} | ID: ${fileId}`);

    return await addFile(fileId, dbRepository);
  };

  return {
    fetchFileById,
    addNewFile,
    process,
    update,
  };
}
