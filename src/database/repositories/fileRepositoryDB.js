import FileModel from "../models/file.js";
import mongoose from "mongoose"

function omit(obj, ...props) {
    const result = { ...obj };
    props.forEach((prop) => delete result[prop]);
    return result;
}

export default  function fileRepositoryDB() {
    const countAll = (params) =>
        FileModel.countDocuments(omit(params, 'page', 'perPage'));

    const findAll = (params) =>
        FileModel.find(omit(params, 'page', 'perPage'))
            .skip(params.perPage * params.page - params.perPage)
            .limit(params.perPage);

    const findById = async (id) => 
        await FileModel.findOne({fileId: id})

    const add = (fileId) => {
        const data = new FileModel({
            fileId,
            status: 'pending',
            totalRows: 0
        });

        return data.save()
    }

    const update = async (fileId, updateData) => {
        const file = await FileModel.findOneAndUpdate({ fileId }, { $set: updateData }, { new: true });
        console.log('UPDATED', file)
        return file
    }
      

    const insertMany = async (data) => 
        await FileModel.insertMany(data);

    return {
        findAll,
        countAll,
        findById,
        add,
        update,
        insertMany
    };

}

