export default function fileRepository(repository) {
    const findAll = (params) => repository.findAll(params);
    const countAll = (params) => repository.countAll(params);
    const findById = (id) => repository.findById(id);
    const add = (file) => repository.add(file);
    const update = (id, data) => repository.update(id, data)
    const insertMany = (data) => repository.insertMany(data)

    return {
      findAll,
      countAll,
      findById,
      add,
      update,
      insertMany
    };
  }