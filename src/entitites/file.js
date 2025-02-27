export default function file(fileId,status, row, cols) {
    return {
      getFileId: () => fileId,
      getStatus: () => status,
      getRow: () => row,
      getCols: () => cols
    };
  }