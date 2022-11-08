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

    switch (item.type) {
      case 'nested':
        return `${plain(item.children, `${path}.`)}`;
      case 'deleted':
        return `Property '${path}' was removed`;
      case 'unchanged':
        return [];
      case 'changed':
        return `Property '${path}' was updated. From ${stringify(item.value1)} to ${stringify(item.value2)}`;
      case 'added':
        return `Property '${path}' was added with value: ${stringify(item.value)}`;
      default:
        throw new Error(`type ${item.type} is not supported`);
    }
  });
  const result = [...lines.flat()].join('\n');

  return result;
};
export default plain;
