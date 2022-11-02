#!/usr/bin/env node

import { program } from 'commander';
import gendiff from '../src/index.js';
import stylish from '../src/stylish.js';

program
  .description('Compares two configuration files and shows a difference.')
  .option('-V, --version', 'output the version number')
  .option('-f, --format <type>', 'output format')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    console.log(stylish(gendiff(filepath1, filepath2), 1));
  });

program.parse();
