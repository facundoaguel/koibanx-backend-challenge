import rowData from '../../../entitites/rowData.js';

export default function addRowData(
  data,
  rowDataRepository
) {
  
  

  const {fileId, row, name, age, nums } = data

  if (!fileId || !row || !name || !age || !nums) {
    throw new Error('fileId, row, name, age, or nums cannot be empty');
  }
  
  const newRowData = rowData(
    fileId,
    row ,
    name,
    age,
    nums
  );

  return rowDataRepository.add(newRowData)
}