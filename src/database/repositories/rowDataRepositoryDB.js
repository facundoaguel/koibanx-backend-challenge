import RowDataModel from "../models/rowData.js";
import FileModel from '../models/file.js'

function omit(obj, ...props) {
    const result = { ...obj };
    props.forEach((prop) => delete result[prop]);
    return result;
}

export default function rowDataRepositoryDB() {
    const countAll = (params) =>
        RowDataModel.countDocuments(omit(params, 'page', 'perPage'));


    const findAll = async (params) => {

        let page = params.page || 1
        let limit = params.perPage || 100

        if (limit > 200){
            limit = 200
        }

        const lowerBound = limit * (page - 1);
        const upperBound = limit * page;
        
        const fileId = params.fileId

        const data = await RowDataModel.find({
            fileId,
            row: { $gte: lowerBound + 1, $lt: upperBound + 1 }
        })
        .select('name age nums row -_id')
        .sort({ row: 1 })
        .limit(limit);

        return data
    }

    const findById = (id) => RowDataModel.findById(id);

    const add = (rowDataEntity) => {
        const data = new RowDataModel({
            fileId: rowDataEntity.getFileId(),
            row: rowDataEntity.getRow(),
            name: rowDataEntity.getName(),
            age: rowDataEntity.getAge(),
            nums: rowDataEntity.getNums()
        });

        return data.save()

    }

    const insertMany = (data) => 
        RowDataModel.insertMany(data);


    return {
        findAll,
        countAll,
        findById,
        add,
        insertMany
    };

}

