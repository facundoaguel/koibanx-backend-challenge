const XLSX = require('xlsx');
const fs = require('fs');

const generateLargeExcel = (filePath) => {
    const data = [];
    
    data.push(["Nombre", "Edad", "Nums"]);

    for (let i = 1; i <= 200000; i++) {
        // let name = `Usuario${i}`;
        // let age = Math.floor(Math.random() * 100) + 1; 
        // let nums = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100)).join(",");

        // if (i % 500 === 0) name = 23; 
        // if (i % 1000 === 0) age = "error"; 
        // if (i % 1500 === 0) nums = "a,b,c";
        
        let name = 23; 
        let age = "error"; 
        let nums = "a,b,c";

        data.push([name, age, nums]);
    }

    

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    XLSX.writeFile(workbook, filePath);
    console.log(`Archivo Excel generado con éxito: ${filePath}`);
};

// Generar archivo
generateLargeExcel("datos_grandes.xlsx");
