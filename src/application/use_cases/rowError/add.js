import rowError from '../../../entitites/rowError.js';

export default function addFile(
  data,
  rowErrorRepository
) {
  
  const { fileId, row, cols } = data

  if (!fileId || !row || !cols ) {
    throw new Error('fileId, row, or cols cannot be empty');
  }

  
  const newRowError = rowError(
    fileId,
    row,
    cols
  );

  return rowErrorRepository.add(newRowError)
}