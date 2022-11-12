import _ from 'lodash';

const getKeys = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const uniqeKeys = _.union(keys1, keys2);
  const sortedKeys = _.sortBy(uniqeKeys, [uniqeKeys.key]);

  return sortedKeys;
};

const buildTree = (obj1, obj2) => {
  const keys = getKeys(obj1, obj2);

  const tree = keys.map((key) => {
    if (!Object.hasOwn(obj2, key)) {
      return { key, value: obj1[key], type: 'deleted' };
    }
    if (!Object.hasOwn(obj1, key)) {
      return { key, value: obj2[key], type: 'added' };
    }
    if (_.isObject(obj1[key]) && _.isObject(obj2[key])) {
      return { key, children: buildTree(obj1[key], obj2[key]), type: 'nested' };
    }
    if (obj1[key] !== obj2[key]) {
      return {
        key, value1: obj1[key], value2: obj2[key], type: 'changed',
      };
    }
    return { key, value: obj1[key], type: 'unchanged' };
  });

  return tree;
};
export default buildTree;
