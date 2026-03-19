import { Request, Response } from 'express';
import chokidar from 'chokidar';

export const watchFiles = (req: Request, res: Response) => {
    console.log('Client connected to file system stream');

    // 1. Establish SSE HTTP connection headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Use the same BASE_DIR logic as your FsService
    const BASE_DIR = process.env.WORKSPACE_DIR || process.cwd();

    // 2. Initialize the Chokidar watcher with strict ignores to protect K8s Pod RAM
    const watcher = chokidar.watch(BASE_DIR, {
        ignored: [
            /(^|[\/\\])\../, // Ignore hidden files/folders (e.g., .git, .env)
            /node_modules/,  // Ignore massive dependency trees
            /dist/,          // Ignore build outputs
            /\.next/         // Ignore Next.js build folders (if applicable)
        ],
        persistent: true,
        ignoreInitial: true // Only report NEW changes, don't scan what already exists
    });

    // 3. Listen for all events (add, change, unlink, addDir, unlinkDir)
    watcher.on('all', (event, filePath) => {
        // Convert the absolute path from the OS into a clean relative path for React
        let relativePath = filePath.replace(BASE_DIR, '').replace(/\\/g, '/');
        if (!relativePath.startsWith('/')) {
            relativePath = '/' + relativePath;
        }

        const payload = JSON.stringify({
            action: event, 
            path: relativePath
        });

        // SSE format strictly requires "data: <string>\n\n"
        res.write(`data: ${payload}\n\n`);
    });

    // 4. Cleanup memory when the React frontend closes the browser tab
    req.on('close', () => {
        console.log('Client disconnected from file stream. Closing watcher.');
        watcher.close();
        res.end();
    });
};