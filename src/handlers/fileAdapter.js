import XLSX from "xlsx";
import getGfs from "../database/connection.js";

export default function fileAdapter() {
    const readFile = async (fileId) => {
        const gfs = getGfs();
        const readStream = gfs.getGfs().createReadStream({ _id: fileId });

        return new Promise((resolve, reject) => {
            const chunks = [];

            readStream.on("data", (chunk) => {
                chunks.push(chunk);
            });

            readStream.on("end", () => {
                try {
                    if (chunks.length === 0) {
                        return reject(new Error("File empty or not exists."));
                    }

                    const buffer = Buffer.concat(chunks);

                    const workbook = XLSX.read(buffer, { type: "buffer" });

                    const sheets = workbook.SheetNames.map(sheetName => ({
                        sheetName,
                        rows: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: "" })
                    }));

                    resolve(sheets);
                } catch (error) {
                    console.error("Error processing file:", error);
                    reject(error);
                }
            });

            readStream.on("error", (err) => {
                console.error("Error reading file:", err);
                reject(err);
            });
        });
    };

    return { readFile };
}
