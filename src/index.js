import { readFileSync } from 'fs';
import _ from 'lodash';
import path from 'path';

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
    return(stringResultWithoutQuotes.replaceAll(',', ''));
}; // gendiff files/file1.json files/file2.json  gendiff file1.json file2.json

export default (filepath1, filepath2) => {
    const data1 = readFileSync(path.resolve(process.cwd(), 'files', filepath1), 'utf-8');
    const data2 = readFileSync(path.resolve(process.cwd(), 'files', filepath2), 'utf-8');
    
    const data1Parse = JSON.parse(data1);
    const data2Parse = JSON.parse(data2);
    
    return genDiff(data1Parse, data2Parse);
};
