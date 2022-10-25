import _ from 'lodash';
import { readFileSync } from 'fs';
import path from 'path';
import parseFile from './parsers.js';

const stringify = (value, replacer = ' ', spacesCount = 1) => {
  const iter = (currentValue, depth) => {
    if (typeof (currentValue) !== 'object' || currentValue === null) {
      return String(currentValue);
    }
    const indentSize = depth * spacesCount;
    const currentIndent = replacer.repeat(indentSize);
    const bracketIndent = replacer.repeat(indentSize - spacesCount);
    const valueToMassive = Object.entries(currentValue);

    const lines = valueToMassive.map(([key, val]) => `${currentIndent}${key}: ${iter(val, depth + 1)}`);
    const result = ['{', ...lines, `${bracketIndent}}`].join('\n');

    return result;
  };

  return iter(value, 1);
};

const genDiff = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const uniqeKeys = _.union(keys1, keys2);

  const sortedKeys = _.sortBy(uniqeKeys, [uniqeKeys.key]);
  const result = {};

  sortedKeys.map((key) => {
    if (!Object.hasOwn(obj2, key)) {
      result[`- ${key}`] = obj1[key];
    }
    if (!Object.hasOwn(obj1, key)) {
      result[`+ ${key}`] = obj2[key];
    }
    if (Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key)) {
      const value1 = obj1[key];
      const value2 = obj2[key];

      if (_.isObject(value1) && _.isObject(value2)) {
        result[`  ${key}`] = genDiff(value1, value2);
      } else {
        if (value1 !== value2) {
          result[`- ${key}`] = obj1[key];
          result[`+ ${key}`] = obj2[key];
        }
        if (value1 === value2) {
          result[`  ${key}`] = obj1[key];
        }
      }
    }

    return result;
  });
  const stringResult = stringify(result, ' ', 2);

  return stringResult;
};
// gendiff file1.json file2.json // gendiff file1.yml file2.yml // gendiff file1.yaml file2.yaml

const getData = (filePath) => {
  const fullPath = path.resolve(process.cwd(), '__fixtures__', filePath);
  const data = readFileSync(fullPath, 'utf-8');

  return data;
};

const getExtension = (filePath) => {
  const extension = path.extname(filePath).split('.');

  return extension[1];
};

export default (filepath1, filepath2) => {
  const data1 = getData(filepath1);
  const data2 = getData(filepath2);

  const extData1 = getExtension(filepath1);
  const extData2 = getExtension(filepath2);

  const parseData1 = parseFile(extData1, data1);
  const parseData2 = parseFile(extData2, data2);

  return genDiff(parseData1, parseData2);
};
