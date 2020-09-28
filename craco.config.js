const CracoLessPlugin = require('craco-less');

module.exports = {
  babel: {
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      '@babel/plugin-proposal-class-properties',
    ],
  },
  webpack: {
    alias: {
      react: require.resolve('react'),
      'teespace-core': require.resolve('teespace-core'),
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  eslint: {
    configure: {
      rules: {
        'no-unused-vars': 'off',
        'no-unused-expressions': 'off',
      },
    },
  },
};
