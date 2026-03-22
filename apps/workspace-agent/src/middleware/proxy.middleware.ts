import { Request, Response, NextFunction, RequestHandler } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { LRUCache } from 'lru-cache';

const proxyCache = new LRUCache<string, RequestHandler>({
  max: 1000, 
  ttl: 1000 * 60 * 60 * 2, 

  dispose: (_, key) => {
    console.log(`[Proxy Cache] Evicted proxy for port ${key} to free up memory.`);
  }
});

export const dynamicProxyHandler = (req: Request, res: Response, next: NextFunction) => {
  const targetPort = String(req.params.port);
  
  if (!targetPort || isNaN(Number(targetPort))) {
    res.status(400).send('Invalid port');
    return;
  }

  if (!proxyCache.has(targetPort)) {
    console.log(`[Proxy Cache] Instantiating new proxy for port ${targetPort}`);
    
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

    proxyCache.set(targetPort, proxy as RequestHandler);
  }

  const cachedProxy = proxyCache.get(targetPort);
  
  if (cachedProxy) {
    cachedProxy(req, res, next);
  } else {
    res.status(500).send('Internal Server Error: Proxy execution failed');
  }
};