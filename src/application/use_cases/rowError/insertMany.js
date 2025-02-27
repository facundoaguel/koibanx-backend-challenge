export default function insertManyError(data, fileRepository,
) {
  return fileRepository.insertMany(data)
}