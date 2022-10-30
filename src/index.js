import _ from 'lodash';
import { readFileSync } from 'fs';
import path from 'path';
import parseFile from './parsers.js';

const stringify = (data, depth) => {
  if (!_.isObject(data)) {
    return `${data}`;
  }
  const spacesCount = 2;
  const indentSize = depth * spacesCount;
  const currentIndent = ' '.repeat(indentSize);
  const bracketIndent = ' '.repeat(indentSize - spacesCount);

  const lines = data.map((item) => {
    if (item.status === 'nested') {
      return `${currentIndent}  ${item.key}: ${stringify(item.children, depth + 1)}`;
    }
    if (item.status === 'deleted') {
      return `${currentIndent}- ${item.key}: ${item.value}`;
    }
    if (item.status === 'unchanged') {
      return `${currentIndent}  ${item.key}: ${item.value}`;
    }
    if (item.status === 'changed') {
      return `${currentIndent}- ${item.key}: ${item.value1}\n  + ${item.key}: ${item.value2}`;
    }
    if (item.status === 'added') {
      return `${currentIndent}+ ${item.key}: ${item.value}`;
    }
    return lines;
  });

  const result = ['{', ...lines, `${bracketIndent}}`].join('\n');

  return result;
}; // gendiff before_flat.json after_flat.json // gendiff before_nested.json after_nested.json

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
      return { key, value: obj1[key], status: 'deleted' };
    }
    if (!Object.hasOwn(obj1, key)) {
      return { key, value: obj2[key], status: 'added' };
    }
    if (_.isObject(obj1[key]) && _.isObject(obj2[key])) {
      return { key, children: genDiff(obj1[key], obj2[key]), status: 'nested' };
    }
    if (obj1[key] !== obj2[key]) {
      return {
        key, value1: obj1[key], value2: obj2[key], status: 'changed',
      };
    }
    return { key, value: obj1[key], status: 'unchanged' };
  });

  // return tree;
  const stringResult = stringify(tree, 1);

  return stringResult;
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

  return genDiff(parseData1, parseData2);
};
