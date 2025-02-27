export default function fileRepository(repository) {
    const findAll = (params) => repository.findAll(params);
    const countAll = (params) => repository.countAll(params);
    const findById = (id) => repository.findById(id);
    const add = (rowData) => repository.add(rowData);
    const insertMany = (data) => repository.insertMany(data)

    return {
      findAll,
      countAll,
      findById,
      add,
      insertMany
    };
}