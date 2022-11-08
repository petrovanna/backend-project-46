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
    if (item.type === 'nested') {
      return `${getIndent(depth)}  ${item.key}: ${stringify((stylish(item.children, depth + 1)), depth)}`;
    }
    if (item.type === 'deleted') {
      return `${getIndent(depth)}- ${item.key}: ${stringify(item.value, depth)}`;
    }
    if (item.type === 'unchanged') {
      return `${getIndent(depth)}  ${item.key}: ${stringify(item.value, depth)}`;
    }
    if (item.type === 'changed') {
      return `${getIndent(depth)}- ${item.key}: ${stringify(item.value1, depth)}\n${getIndent(depth)}+ ${item.key}: ${stringify(item.value2, depth)}`;
    }
    if (item.type === 'added') {
      return `${getIndent(depth)}+ ${item.key}: ${stringify(item.value, depth)}`;
    }
    return lines;
  });

  const result = ['{', ...lines, `${getBracketIndent(depth)}}`].join('\n');

  return result;
};
export default stylish;
