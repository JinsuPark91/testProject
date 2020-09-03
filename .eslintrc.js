module.exports = {
  env: {
    node: true,
    es6: true,
    browser: true,
    jest: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'prettier',
    'prettier/react',
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'react/jsx-filename-extension': 0,
    'react/prefer-stateless-function': 0,
  },
};
