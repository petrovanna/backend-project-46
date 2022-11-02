import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import genDiff from '../src/index.js';
import stylish from '../src/stylish.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);
const readFixture = (filename) => readFileSync(getFixturePath(filename), 'utf-8');

test.each([
  [getFixturePath('before_nested.json'), getFixturePath('after_nested.json'), readFixture('expected_nested.txt')],
  [getFixturePath('before_nested.yml'), getFixturePath('after_nested.yml'), readFixture('expected_nested.txt')],
  [getFixturePath('before_nested.yaml'), getFixturePath('after_nested.yaml'), readFixture('expected_nested.txt')],
])('must be equal "expected_nested.txt"', (filePath1, filePath2, expected) => {
  expect(stylish((genDiff(filePath1, filePath2)), 1)).toBe(expected);
});
