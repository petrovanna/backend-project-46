#!/usr/bin/env node

import { program } from 'commander';
import formater from '../src/formatters/index.js';
import gendiff from '../src/index.js';

program
  .description('Compares two configuration files and shows a difference.')
  .option('-V, --version', 'output the version number')
  .option('-f, --format <type>', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    console.log(formater(gendiff(filepath1, filepath2), program.opts().format));
  });

program.parse();
