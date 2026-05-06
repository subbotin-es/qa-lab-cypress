const cypress = require('eslint-plugin-cypress');

module.exports = [
  cypress.configs.recommended,
  {
    files: ['cypress/**/*.js'],
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
    },
  },
];
