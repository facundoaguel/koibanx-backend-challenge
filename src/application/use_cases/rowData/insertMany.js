export default function insertManyData(data, fileRepository,
) {
  return fileRepository.insertMany(data)
}