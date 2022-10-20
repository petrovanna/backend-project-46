import yaml from 'js-yaml';

const parseFile = (getExtension, getData) => {
  let dataParse;
  switch (getExtension) {
    case '.json':
      dataParse = JSON.parse(getData);
      return dataParse;
    case '.yml':
    case '.yaml':
      dataParse = yaml.load(getData);
      return dataParse;
    default:
      throw new Error(`extension ${getExtension} is not supported`);
  }
};
export default parseFile;

// версия кода до вытаскивания из parsers чтения файла и расширения
/* import { readFileSync } from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const parseFile = (filePath) => {
  const fullPath = path.resolve(process.cwd(), '__fixtures__', filePath);
  const data = readFileSync(fullPath, 'utf-8');
  const extension = path.extname(filePath).split('.');
  const fileExtension = extension[1];

  let dataParse;
  switch (fileExtension) {
    case 'json':
      dataParse = JSON.parse(data);
      return dataParse;
    case 'yml':
    case 'yaml':
      dataParse = yaml.load(data);
      return dataParse;
    default:
      throw new Error(`extension ${fileExtension} is not supported`);
  }
};
export default parseFile; */
