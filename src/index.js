import { readFileSync } from 'fs';
import _ from 'lodash';
import path from 'path';

const genDiff = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const unitedKeys = keys1.concat(keys2);
  const uniqeKeys = _.union(unitedKeys);
  const sortedKeys = _.sortBy(uniqeKeys, [uniqeKeys.key]);

  console.log('1)', sortedKeys);
  const result = {};

  sortedKeys.map((key) => {
    if (!Object.hasOwn(obj2, key)) {
      result[` - ${key}`] = obj1[key];
    }
    if (!Object.hasOwn(obj1, key)) {
      result[` + ${key}`] = obj2[key];
    }
    if (Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key)) {
      const value1 = obj1[key];
      const value2 = obj2[key];
      if (value1 !== value2) {
        result[` - ${key}`] = obj1[key];
        result[` + ${key}`] = obj2[key];
      }
      if (value1 === value2) {
        result[`   ${key}`] = obj1[key];
      }
    }
    return result;
  });
  console.log('2)', result);

  const stringResult = JSON.stringify(result, null, ' ');
  const stringResultWithoutQuotes = stringResult.replaceAll('"', '');
  return (stringResultWithoutQuotes.replaceAll(',', ''));
}; // gendiff file1.json file2.json

const readFile = (filePath) => {
  const fullPath = path.resolve(process.cwd(), 'files', filePath);
  const data = readFileSync(fullPath, 'utf-8');
  const dataParse = JSON.parse(data);
  return dataParse;
};

export default (filepath1, filepath2) => {
  const data1 = readFile(filepath1);
  const data2 = readFile(filepath2);

  return genDiff(data1, data2);
};
