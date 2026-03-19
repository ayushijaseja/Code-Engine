import fs from 'fs/promises';
import path from 'path';
import { FileNode } from '@repo/shared-types';
require('dotenv').config()

export class FsService {
    // In production, this would be '/workspace'. 
    // For local testing, we'll use the current directory or a temp folder.
    private static readonly BASE_DIR = process.env.WORKSPACE_DIR || process.cwd();

    private static securePath(requestedPath: string): string {
        const resolvedPath = path.resolve(this.BASE_DIR, requestedPath.replace(/^\//, ''));
        if (!resolvedPath.startsWith(this.BASE_DIR)) {
            throw new Error("Access Denied: Path Traversal Detected");
        }
        
        return resolvedPath;
    }

    public static async buildTree(currentDir: string = ''): Promise<FileNode[]> {
        const targetDir = this.securePath(currentDir);
        const entries = await fs.readdir(targetDir, { withFileTypes: true });
        
        const nodes: FileNode[] = [];

        for (const entry of entries) {
            if (entry.name === 'node_modules' || entry.name === '.git') continue;

            const entryPath = path.join(currentDir, entry.name);
            const absolutePath = path.join(targetDir, entry.name);
            const isDirectory = entry.isDirectory();
            const isHidden = entry.name.startsWith('.');

            let size: number | undefined;
            let extension: string | undefined;

            if (!isDirectory) {
                const stats = await fs.stat(absolutePath);
                size = stats.size;
                extension = path.extname(entry.name); 
            }

            nodes.push({
                name: entry.name,
                path: entryPath,
                type: isDirectory ? 'directory' : 'file',
                isHidden,
                extension,
                size,
                children: isDirectory ? await this.buildTree(entryPath) : undefined
            });
        }

        return nodes.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'directory' ? -1 : 1;
        });
    }

    public static async readFile(filePath: string): Promise<string> {
        const securePath = this.securePath(filePath);
        return await fs.readFile(securePath, 'utf8');
    }

    public static async writeFile(filePath: string, content: string): Promise<void> {
        const securePath = this.securePath(filePath);
        await fs.mkdir(path.dirname(securePath), { recursive: true });
        await fs.writeFile(securePath, content, 'utf8');
    }

    public static async create(targetPath: string, type: 'file' | 'directory'): Promise<void> {
        const securePath = this.securePath(targetPath);
        
        if (type === 'directory') {
            await fs.mkdir(securePath, { recursive: true });
        } else {
            await fs.mkdir(path.dirname(securePath), { recursive: true });
            await fs.writeFile(securePath, '', 'utf8');
        }
    }

    public static async delete(targetPath: string): Promise<void> {
        const securePath = this.securePath(targetPath);
        await fs.rm(securePath, { recursive: true, force: true });
    }

    public static async rename(oldPath: string, newPath: string): Promise<void> {
        const secureOldPath = this.securePath(oldPath);
        const secureNewPath = this.securePath(newPath);
        
        await fs.mkdir(path.dirname(secureNewPath), { recursive: true });
        await fs.rename(secureOldPath, secureNewPath);
    }
}