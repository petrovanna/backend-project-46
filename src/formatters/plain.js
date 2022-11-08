const stringify = (value) => {
  if (value === null) {
    return value;
  }
  if (typeof (value) === 'object') {
    return '[complex value]';
  }
  if (typeof (value) === 'string') {
    return `'${value}'`;
  }

  return value;
};

const plain = (data, copyPath = '') => {
  const lines = data.map((item) => {
    const path = `${copyPath}${item.key}`;

    if (item.type === 'nested') {
      return `${plain(item.children, `${path}.`)}`;
    }
    if (item.type === 'deleted') {
      return `Property '${path}' was removed`;
    }
    if (item.type === 'unchanged') {
      return [];
    }
    if (item.type === 'changed') {
      return `Property '${path}' was updated. From ${stringify(item.value1)} to ${stringify(item.value2)}`;
    }
    if (item.type === 'added') {
      return `Property '${path}' was added with value: ${stringify(item.value)}`;
    }
    return lines;
  });

  const result = [...lines.flat()].join('\n');

  return result;
};
export default plain;
