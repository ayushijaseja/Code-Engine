import { Request, Response } from 'express';
import chokidar from 'chokidar';

export const watchFiles = (req: Request, res: Response) => {
    console.log('Client connected to file system stream');

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const BASE_DIR = process.env.WORKSPACE_DIR || process.cwd();

    const watcher = chokidar.watch(BASE_DIR, {
        ignored: [
            /(^|[\/\\])\../, 
            /node_modules/, 
            /dist/,         
            /\.next/     
        ],
        persistent: true,
        ignoreInitial: true 
    });

    watcher.on('all', (event, filePath) => {
        let relativePath = filePath.replace(BASE_DIR, '').replace(/\\/g, '/');
        if (!relativePath.startsWith('/')) {
            relativePath = '/' + relativePath;
        }

        const payload = JSON.stringify({
            action: event, 
            path: relativePath
        });

        res.write(`data: ${payload}\n\n`);
    });

    req.on('close', () => {
        console.log('Client disconnected from file stream. Closing watcher.');
        watcher.close();
        res.end();
    });
};