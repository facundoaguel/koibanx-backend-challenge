export default function rowData(fileId, status, totalRows) {
    return {
      getFileId: () => fileId,
      getStatus: () => status,
      getTotalRows: () => totalRows
    };
  }