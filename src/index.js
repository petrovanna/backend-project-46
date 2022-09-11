import { readFileSync } from 'fs';

export default (filepath1, filepath2) => {
    const data1 = readFileSync(filepath1, 'utf-8');
    const data2 = readFileSync(filepath2, 'utf-8');
    
    const data1Parse = JSON.parse(data1);
    const data2Parse = JSON.parse(data2);

    console.log(data1Parse);
    console.log(data2Parse);
};
