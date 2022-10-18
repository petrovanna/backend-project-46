import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import { readFileSync } from 'fs';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);
const readFixture = (filename) => readFileSync(getFixturePath(filename), 'utf-8');

const expected = readFixture('expected_file.txt');

test('JSON must be equal "expected_file.txt"', () => {
  const filePath1 = getFixturePath('file1.json');
  const filePath2 = getFixturePath('file2.json');

  console.log(extname(filePath1));
  expect(genDiff(filePath1, filePath2)).toEqual(expected);
});

test('YML must be equal "expected_file.txt"', () => {
  const filePath1 = getFixturePath('file1.yml');
  const filePath2 = getFixturePath('file2.yml');

  expect(genDiff(filePath1, filePath2)).toEqual(expected);
});

test('YAML must be equal "expected_file.txt"', () => {
  const filePath1 = getFixturePath('file1.yaml');
  const filePath2 = getFixturePath('file2.yaml');

  expect(genDiff(filePath1, filePath2)).toEqual(expected);
});
