module.exports = {
  parser: 'babel-eslint',
  env: {
    node: true,
    es6: true,
    browser: true,
    jest: true,
  },
  extends: [
    'airbnb',
    'airbnb-base',
    'airbnb/hooks',
    'prettier',
    'prettier/react',
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-console': 0,
    'react/jsx-filename-extension': 0,
    'react/prefer-stateless-function': 0,
    'react/prop-types': 0,
    'react/jsx-props-no-spreading': 0,
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
};
