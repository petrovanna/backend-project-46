import { readFileSync } from 'fs';
import _ from 'lodash';

const genDiff = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    const unitedKeys = keys1.concat(keys2);
    const uniqeKeys = _.union(unitedKeys);
    console.log('unitedKeys', unitedKeys);
    console.log('uniqeKeys', uniqeKeys);
};

export default (filepath1, filepath2) => {
    const data1 = readFileSync(filepath1, 'utf-8');
    const data2 = readFileSync(filepath2, 'utf-8');
    
    const data1Parse = JSON.parse(data1);
    const data2Parse = JSON.parse(data2);
    
    genDiff(data1Parse, data2Parse);
};
