export default function rowError(fileId, row, cols) {
    return {
      getFileId: () => fileId,
      getRow: () => row,
      getCols: () => cols
    };
  }