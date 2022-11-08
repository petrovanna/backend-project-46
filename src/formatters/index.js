import plain from './plain.js';
import stylish from './stylish.js';

const formater = (data, format = 'stylish') => {
  switch (format) {
    case 'stylish':
      return stylish(data);
    case 'plain':
      return plain(data);
    case 'json':
      return JSON.stringify(data);
    default:
      throw new Error(`format ${format} is not supported`);
  }
};
export default formater;
// gendiff -f stylish before_nested.json after_nested.json
// gendiff -f plain before_nested.json after_nested.json
// gendiff -f json before_nested.json after_nested.json
