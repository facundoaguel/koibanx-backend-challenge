const XLSX = require('xlsx');
const fs = require('fs');

const generateLargeExcel = (filePath) => {
    const data = [];
    
    // Encabezados
    data.push(["Nombre", "Edad", "Nums"]);

    // Generar 200,000 filas de datos ficticios
    for (let i = 1; i <= 200000; i++) {
        let name = `Usuario${i}`;
        let age = Math.floor(Math.random() * 100) + 1; // Edad entre 1 y 100
        let nums = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100)).join(",");

        if (i % 500 === 0) name = 23; // Error: Nombre vacío
        if (i % 1000 === 0) age = "error"; // Error: Edad en string en lugar de número
        if (i % 1500 === 0) nums = "a,b,c"; // Error: Valores no numéricos en Nums

        data.push([name, age, nums]);
    }

    // Crear hoja de cálculo
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    // Guardar el archivo
    XLSX.writeFile(workbook, filePath);
    console.log(`Archivo Excel generado con éxito: ${filePath}`);
};

// Generar archivo
generateLargeExcel("datos_grandes.xlsx");
