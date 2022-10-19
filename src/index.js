import _ from 'lodash';
import readFile from './parsers.js';

const genDiff = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const unitedKeys = keys1.concat(keys2);
  const uniqeKeys = _.union(unitedKeys);
  const sortedKeys = _.sortBy(uniqeKeys, [uniqeKeys.key]);

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

  const stringResult = JSON.stringify(result, null, ' ');
  const stringResultWithoutQuotes = stringResult.replaceAll('"', '');
  return (stringResultWithoutQuotes.replaceAll(',', ''));
}; // gendiff file1.json file2.json
// gendiff file1.yml file2.yml // gendiff file1.yaml file2.yaml

export default (filepath1, filepath2) => {
  const data1 = readFile(filepath1);
  const data2 = readFile(filepath2);

  return genDiff(data1, data2);
};
