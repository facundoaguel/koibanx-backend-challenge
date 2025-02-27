import RowErrorModel from "../models/rowError.js";

function omit(obj, ...props) {
    const result = { ...obj };
    props.forEach((prop) => delete result[prop]);
    return result;
}

export default function rowErrorRepositoryDB() {
    const countAll = (params) =>
        RowErrorModel.countDocuments(omit(params, 'page', 'perPage'));

    const findAll = async (params) => {

        let page = params.page || 1
        let limit = params.perPage || 100

        
        if (limit > 200){
            limit = 200
        }

        const lowerBound = limit * (page - 1);
        const upperBound = limit * page;
        
        const fileId = params.fileId

        const data = await RowErrorModel.find({
            fileId,
            row: { $gte: lowerBound + 1, $lt: upperBound + 1 }
        })
        .select('row cols -_id')
        .sort({ row: 1 })
        .limit(limit);

        return data
    }

    const findById = (id) => RowErrorModel.findById(id);

    const add = (rowErrorEntity) => {
        const data = new RowErrorModel({
            fileId: rowErrorEntity.getFileId(),
            row: rowErrorEntity.getRow(),
            cols: rowErrorEntity.getCols()
        });

        return data.save()

    }

    const insertMany = (data) => 
        RowErrorModel.insertMany(data);


    return {
        findAll,
        countAll,
        findById,
        add,
        insertMany
    };

}

