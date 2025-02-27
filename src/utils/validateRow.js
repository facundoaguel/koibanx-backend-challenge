export default function validateRow(row, rowIndex){
    const errors = [];
    const name = row[0]; 
    const age = row[1]; 
    const nums = row[2]; 

    //validacion
    if (!name || typeof name !== 'string') {
        errors.push(1);
    }
    if (!age || isNaN(age)) {
        errors.push(2);
    }
    if (!nums || typeof nums !== 'string') {
        errors.push(3);
    } else {
        const numsArray = nums.split(',').map(num => parseInt(num, 10)).filter(n => !isNaN(n));
        if (numsArray.length === 0) {
            errors.push(3);
        }
    }

    return { hasError: errors.length > 0, errors };
};