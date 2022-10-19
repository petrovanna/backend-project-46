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
  [getFixturePath('file1.json'), getFixturePath('file2.json'), readFixture('expected_file.txt')],
  [getFixturePath('file1.yml'), getFixturePath('file2.yml'), readFixture('expected_file.txt')],
  [getFixturePath('file1.yaml'), getFixturePath('file2.yaml'), readFixture('expected_file.txt')],
])('must be equal "expected_file.txt"', (filePath1, filePath2, expected) => {
  expect(genDiff(filePath1, filePath2)).toBe(expected);
});
