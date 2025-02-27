import findAll from '../../application/use_cases/rowData/findAll.js';

export default function rowDataController(
  rowDataRepository,
  rowDataRepositoryImpl,
) {
  const dbRepository = rowDataRepository(rowDataRepositoryImpl());

  const findAllData = async (params) => {
    try {
      
      const data = await findAll(params, dbRepository);
      return data; 
    } catch (error) {
      throw error;
    }
  };

  return {
    findAllData
  };
}