import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

export const dynamicProxyHandler = (req: Request, res: Response, next: NextFunction) => {
  const targetPort = req.params.port;
  
  if (!targetPort || isNaN(Number(targetPort))) {
    res.status(400).send('Invalid port');
    return;
  }

  const proxy = createProxyMiddleware({
    target: `http://127.0.0.1:${targetPort}`,
    changeOrigin: true,
    ws: true, 
    pathRewrite: {
      [`^/proxy/${targetPort}`]: '', 
    },
    on: {
      error: (err, proxyReq, proxyRes) => {
        console.error(`[Proxy Error] Port ${targetPort}:`, err.message);
        
        if ('writeHead' in proxyRes) {
          if (!proxyRes.headersSent) {
            proxyRes.writeHead(502, { 'Content-Type': 'text/plain' });
            proxyRes.end(`Port ${targetPort} is not running a server yet.`);
          }
        } else {
          proxyRes.end('HTTP/1.1 502 Bad Gateway\r\n\r\n');
        }
      }
    }
  });

  proxy(req, res, next);
};