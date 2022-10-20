import { readFileSync } from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const parseFile = (filePath) => {
  const fullPath = path.resolve(process.cwd(), '__fixtures__', filePath);
  const data = readFileSync(fullPath, 'utf-8');
  const extension = path.extname(fullPath);

  let dataParse;
  switch (extension) {
    case '.json':
      dataParse = JSON.parse(data);
      return dataParse;
    case '.yml':
    case '.yaml':
      dataParse = yaml.load(data);
      return dataParse;
    default:
      throw new Error(`extension ${extension} is not supported`);
  }
};
export default parseFile;
