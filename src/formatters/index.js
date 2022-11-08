import plain from './plain.js';
import stylish from './stylish.js';

const formater = (data, format = 'stylish') => {
  switch (format) {
    case 'stylish':
      return stylish(data);
    case 'plain':
      return plain(data);
    default:
      throw new Error(`format ${format} is not supported`);
  }
};
export default formater;
