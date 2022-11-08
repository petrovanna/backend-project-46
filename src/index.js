import _ from 'lodash';
import { readFileSync } from 'fs';
import path from 'path';
import parseFile from './parsers.js';

const getKeys = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const uniqeKeys = _.union(keys1, keys2);
  const sortedKeys = _.sortBy(uniqeKeys, [uniqeKeys.key]);

  return sortedKeys;
};

const genDiff = (obj1, obj2) => {
  const keys = getKeys(obj1, obj2);

  const tree = keys.map((key) => {
    if (!Object.hasOwn(obj2, key)) {
      return { key, value: obj1[key], type: 'deleted' };
    }
    if (!Object.hasOwn(obj1, key)) {
      return { key, value: obj2[key], type: 'added' };
    }
    if (_.isObject(obj1[key]) && _.isObject(obj2[key])) {
      return { key, children: genDiff(obj1[key], obj2[key]), type: 'nested' };
    }
    if (obj1[key] !== obj2[key]) {
      return {
        key, value1: obj1[key], value2: obj2[key], type: 'changed',
      };
    }
    return { key, value: obj1[key], type: 'unchanged' };
  });

  return tree;
};

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

  return (genDiff(parseData1, parseData2));
};
