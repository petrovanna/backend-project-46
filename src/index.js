import _ from 'lodash';
import { readFileSync } from 'fs';
import path from 'path';
import parseFile from './parsers.js';

/* const stringify = (value) => {
  const result = JSON.stringify(value, null, ' ');
  const resultWithoutQuotes = result.replaceAll('"', '');

  return resultWithoutQuotes.replaceAll(',', '');
}; */

const getIndent = (depth, spacesCount = 4) => ' '.repeat(depth * spacesCount - 2);

const getBracketIndent = (depth, spacesCount = 2) => ' '.repeat(depth * spacesCount - spacesCount);

const stringify = (value, depth) => {
  if (typeof (value) !== 'object' || value === null) {
    return String(value);
  }
  const arrayOfValue = Object.entries(value);
  const lines = arrayOfValue.map(([key, val]) => `${getIndent(depth + 1)}  ${key}: ${stringify(val, depth + 1)}`);
  const result = ['{', ...lines, `${getIndent(depth)}  }`].join('\n');

  return result;
};

const stylish = (data, depth) => {
  /* if (!_.isObject(data)) {
    return `${data}`;
  } */
  const lines = data.map((item) => {
    if (item.type === 'nested') {
      return `${getIndent(depth)}  ${item.key}: ${stringify(item.children, depth + 1)}`;
    }
    if (item.type === 'deleted') {
      return `${getIndent(depth)}- ${item.key}: ${stringify(item.value, depth)}`;
    }
    if (item.type === 'unchanged') {
      return `${getIndent(depth)}  ${item.key}: ${stringify(item.value, depth)}`;
    }
    if (item.type === 'changed') {
      return `${getIndent(depth)}- ${item.key}: ${stringify(item.value1, depth)}\n${getIndent(depth)}+ ${item.key}: ${stringify(item.value2, depth)}`;
    }
    if (item.type === 'added') {
      return `${getIndent(depth)}+ ${item.key}: ${stringify(item.value, depth)}`;
    }
    return lines;
  });

  const result = ['{', ...lines, `${getBracketIndent(depth)}}`].join('\n');

  return result;
}; // gendiff before_flat.json after_flat.json // gendiff before_nested.json after_nested.json
// gendiff before_nested.yml after_nested.yml

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

  // return tree;
  const stringResult = stylish(tree, 1);

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
