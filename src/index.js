import { readFileSync } from 'fs';
import path from 'path';
import parseFile from './parsers.js';
import formater from './formatters/index.js';
import buildTree from './buildTree.js';

const getData = (filePath) => {
  const fullPath = path.resolve(process.cwd(), filePath);
  const data = readFileSync(fullPath, 'utf-8');

  return data;
};

const getExtension = (filePath) => {
  const extension = path.extname(filePath).split('.');

  return extension[1];
};

export default (filepath1, filepath2, formatName) => {
  const data1 = getData(filepath1);
  const data2 = getData(filepath2);

  const extData1 = getExtension(filepath1);
  const extData2 = getExtension(filepath2);

  const parseData1 = parseFile(extData1, data1);
  const parseData2 = parseFile(extData2, data2);

  return formater(buildTree(parseData1, parseData2), formatName);
};
