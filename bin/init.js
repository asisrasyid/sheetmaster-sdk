#!/usr/bin/env node
'use strict';

const { scaffold } = require('../dist/scaffold');

scaffold(process.cwd()).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
