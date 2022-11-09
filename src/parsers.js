import yaml from 'js-yaml';

const parseFile = (getExtension, getData) => {
  switch (getExtension) {
    case 'json':
      return JSON.parse(getData);
    case 'yml':
    case 'yaml':
      return yaml.load(getData);
    default:
      throw new Error(`extension ${getExtension} is not supported`);
  }
};
export default parseFile;
