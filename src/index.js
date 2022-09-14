import { readFileSync } from 'fs';
import _ from 'lodash';

const genDiff = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    const unitedKeys = keys1.concat(keys2);
    const uniqeKeys = _.union(unitedKeys);
    const sortedKeys = _.sortBy(uniqeKeys , [uniqeKeys.key]);

    const result = {};
    
    for (const key of sortedKeys) {
        
        if (!Object.hasOwn(obj2, key)) {
            result[` - ${key}`] = obj1 [key];
        }
        if (!Object.hasOwn(obj1, key)) {
            result [` + ${key}`] = obj2 [key];
        }
        if (Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key)) {
            const value1 = obj1[key];
            const value2 = obj2[key];
            
            if (value1 !== value2) {
                result [` - ${key}`] = obj1[key];
                result [` + ${key}`] = obj2[key];
            }
            if (value1 === value2) {
                result [`   ${key}`] = obj1[key];
            }
        }
    }
    const stringResult = JSON.stringify(result, null, ' ');
    const stringResultWithoutQuotes = stringResult.replaceAll('"', '')
    console.log(stringResultWithoutQuotes.replaceAll(',', ''));
}; // gendiff files/file1.json files/file2.json

export default (filepath1, filepath2) => {
    const data1 = readFileSync(filepath1, 'utf-8');
    const data2 = readFileSync(filepath2, 'utf-8');
    
    const data1Parse = JSON.parse(data1);
    const data2Parse = JSON.parse(data2);
    
    genDiff(data1Parse, data2Parse);
};
