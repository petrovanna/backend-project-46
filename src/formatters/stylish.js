const getIndent = (depth, spacesCount = 4) => ' '.repeat(depth * spacesCount - 2);

const getBracketIndent = (depth, spacesCount = 4) => ' '.repeat((depth * spacesCount) - 4);

export const stringify = (value, depth) => {
  if (typeof (value) !== 'object' || value === null) {
    return String(value);
  }
  const arrayOfValue = Object.entries(value);
  const lines = arrayOfValue.map(([key, val]) => `${getIndent(depth + 1)}  ${key}: ${stringify(val, depth + 1)}`);
  const result = ['{', ...lines, `${getIndent(depth)}  }`].join('\n');

  return result;
};

const stylish = (data, depth = 1) => {
  const lines = data.map((item) => {
    switch (item.type) {
      case 'nested':
        return `${getIndent(depth)}  ${item.key}: ${stringify((stylish(item.children, depth + 1)), depth)}`;
      case 'deleted':
        return `${getIndent(depth)}- ${item.key}: ${stringify(item.value, depth)}`;
      case 'unchanged':
        return `${getIndent(depth)}  ${item.key}: ${stringify(item.value, depth)}`;
      case 'changed':
        return `${getIndent(depth)}- ${item.key}: ${stringify(item.value1, depth)}\n${getIndent(depth)}+ ${item.key}: ${stringify(item.value2, depth)}`;
      case 'added':
        return `${getIndent(depth)}+ ${item.key}: ${stringify(item.value, depth)}`;
      default:
        throw new Error(`type ${item.type} is not supported`);
    }
  });
  const result = ['{', ...lines, `${getBracketIndent(depth)}}`].join('\n');

  return result;
};
export default stylish;
