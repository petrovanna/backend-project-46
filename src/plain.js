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

const plain = (data) => {
  // console.log('data', data); //

  const lines = data.map((item) => {
    console.log('item', item); //

    if (item.type === 'nested') {
      return `${plain(item.children)}`; // gendiff before_nested.json after_nested.json
    }
    if (item.type === 'deleted') {
      return `Property '${item.key}' was removed`;
    }
    if (item.type === 'unchanged') {
      return [];
    }
    if (item.type === 'changed') {
      return `Property '${item.key}' was updated. From ${stringify(item.value1)} to ${stringify(item.value2)}`;
    }
    if (item.type === 'added') {
      return `Property '${item.key}' was added with value: ${stringify(item.value)}`;
    }
    return lines;
  });

  const result = [...lines.flat()].join('\n');

  return result;
};
export default plain;
