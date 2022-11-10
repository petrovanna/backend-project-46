import yaml from 'js-yaml';

const parseFile = (dataFormat, data) => {
  switch (dataFormat) {
    case 'json':
      return JSON.parse(data);
    case 'yml':
    case 'yaml':
      return yaml.load(data);
    default:
      throw new Error(`extension ${dataFormat} is not supported`);
  }
};
export default parseFile;
