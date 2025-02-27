
import findAll from '../../application/use_cases/rowError/findAll.js';

export default function rowDataController(
  rowErrorRepository,
  rowErrorRepositoryImpl,
) {
  const dbRepository = rowErrorRepository(rowErrorRepositoryImpl());

  const findAllData = async (params) => {
    try {
      
      const data = await findAll(params, dbRepository);

      const formattedErrors = data.map(({ row, cols }) => 
        cols.map(col => ({ row, col }))
      );

      return formattedErrors; 

    } catch (error) {
      throw error;
    }
  };

  return {
    findAllData
  };
}