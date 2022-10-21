import yaml from 'js-yaml';

const parseFile = (getExtension, getData) => {
  let dataParse;
  switch (getExtension) {
    case 'json':
      dataParse = JSON.parse(getData);
      return dataParse;
    case 'yml':
    case 'yaml':
      dataParse = yaml.load(getData);
      return dataParse;
    default:
      throw new Error(`extension ${getExtension} is not supported`);
  }
};
export default parseFile;
