const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = app => {
  app.use(
    createProxyMiddleware('/CMS', {
      target: process.env.REACT_APP_DOMAIN_URL,
      changeOrigin: true,
      preserveHeaderKeyCase: true,
      onProxyReq: (proxyReq, req /* , res */) => {
        if (req.headers.proobjectwebfiletransfer) {
          proxyReq.setHeader('ProObjectWebFileTransfer', true);
        }
      },
    }),
    createProxyMiddleware('/photo', {
      target: process.env.REACT_APP_DOMAIN_URL,
      changeOrigin: true,
    }),
  );
};
