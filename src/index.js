import _ from 'lodash';
import { readFileSync } from 'fs';
import path from 'path';
import parseFile from './parsers.js';

const stringify = (value, replacer = ' ', spacesCount = 1) => {
  const iter = (currentValue, depth) => {
    if (!_.isObject(currentValue)) {
      return `${currentValue}`;
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

// {
// name: /* ... */,
// type: 'directory',
// meta: {}, // Свойства директории
// children: [/* ... */], // Здесь хранятся дети
// }

const genDiff = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const uniqeKeys = _.union(keys1, keys2);

  const sortedKeys = _.sortBy(uniqeKeys, [uniqeKeys.key]);

  const tree = sortedKeys.map((key) => {
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

  return tree;
  // const stringResult = stringify(tree, ' ', 2);

  // return stringResult;
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
