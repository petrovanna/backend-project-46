import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);
const readFixture = (filename) => readFileSync(getFixturePath(filename), 'utf-8');

test.each([
  [getFixturePath('before_nested.json'), getFixturePath('after_nested.json'), readFixture('expected_nested.txt')],
  [getFixturePath('before_nested.yml'), getFixturePath('after_nested.yml'), readFixture('expected_nested.txt')],
  [getFixturePath('before_nested.yaml'), getFixturePath('after_nested.yaml'), readFixture('expected_nested.txt')],
])('must be equal "expected_nested.txt"', (filePath1, filePath2, expected) => {
  expect(genDiff(filePath1, filePath2)).toBe(expected);
});

/* test.each([
  [getFixturePath('before_flat.json'), getFixturePath('after_flat.json'),
  readFixture('expected_flat.txt')],
  // [getFixturePath('file1.yml'), getFixturePath('file2.yml'), readFixture('expected_file.txt')],
  // [getFixturePath('file1.yaml'), getFixturePath('file2.yaml'), readFixture('expected_file.txt')],
])('must be equal "expected_flat.txt"', (filePath1, filePath2, expected) => {
  expect(genDiff(filePath1, filePath2)).toBe(expected);
}); */
