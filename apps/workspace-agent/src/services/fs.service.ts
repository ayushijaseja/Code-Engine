import fs from 'fs/promises';
import path from 'path';
import type { Dirent } from 'fs'; 
import { FileNode } from '@repo/shared-types';
import 'dotenv/config'; 

export class FsService {
    private static readonly BASE_DIR: string = process.env.WORKSPACE_DIR || process.cwd();

    private static securePath(requestedPath: string): string {
        const resolvedPath: string = path.resolve(this.BASE_DIR, requestedPath.replace(/^\//, ''));
        
        const isSafe: boolean = resolvedPath === this.BASE_DIR || resolvedPath.startsWith(this.BASE_DIR + path.sep);
        
        if (!isSafe) {
            throw new Error(`Access Denied: Path Traversal Detected (${requestedPath})`);
        }
        
        return resolvedPath;
    }

    private static toPosix(filePath: string): string {
        return filePath.split(path.sep).join('/');
    }

    public static async buildTree(currentDir: string = ''): Promise<FileNode[]> {
        const targetDir: string = this.securePath(currentDir);
        
        const entries: Dirent[] = await fs.readdir(targetDir, { withFileTypes: true });
        
        const nodePromises: Promise<FileNode>[] = entries
            .filter((entry: Dirent) => entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist')
            .map(async (entry: Dirent): Promise<FileNode> => {
                const relativePath: string = currentDir === '' ? `/${entry.name}` : `${currentDir}/${entry.name}`;
                const absolutePath: string = path.join(targetDir, entry.name);
                
                const isDirectory: boolean = entry.isDirectory();
                const isHidden: boolean = entry.name.startsWith('.');

                let size: number | undefined;
                let extension: string | undefined;

                if (!isDirectory) {
                    const stats = await fs.stat(absolutePath);
                    size = stats.size;
                    extension = path.extname(entry.name); 
                }

                return {
                    name: entry.name,
                    path: relativePath,
                    type: isDirectory ? 'directory' : 'file',
                    isHidden,
                    extension,
                    size,
                    children: isDirectory ? await this.buildTree(relativePath) : undefined
                };
            });

        const nodes: FileNode[] = await Promise.all(nodePromises);

        return nodes.sort((a: FileNode, b: FileNode) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'directory' ? -1 : 1;
        });
    }

    public static async readFile(filePath: string): Promise<string> {
        return await fs.readFile(this.securePath(filePath), 'utf8');
    }

    public static async writeFile(filePath: string, content: string): Promise<void> {
        const securePath: string = this.securePath(filePath);
        await fs.mkdir(path.dirname(securePath), { recursive: true });
        await fs.writeFile(securePath, content, 'utf8');
    }

    public static async create(targetPath: string, type: 'file' | 'directory'): Promise<void> {
        const securePath: string = this.securePath(targetPath);
        
        if (type === 'directory') {
            await fs.mkdir(securePath, { recursive: true });
        } else {
            await fs.mkdir(path.dirname(securePath), { recursive: true });
            const exists: boolean = await fs.access(securePath).then(() => true).catch(() => false);
            if (!exists) {
                await fs.writeFile(securePath, '', 'utf8');
            }
        }
    }

    public static async delete(targetPath: string): Promise<void> {
        if (targetPath === '/' || targetPath === '') {
            throw new Error("Cannot delete workspace root");
        }
        await fs.rm(this.securePath(targetPath), { recursive: true, force: true });
    }

    public static async rename(oldPath: string, newPath: string): Promise<void> {
        const secureNewPath: string = this.securePath(newPath);
        await fs.mkdir(path.dirname(secureNewPath), { recursive: true });
        await fs.rename(this.securePath(oldPath), secureNewPath);
    }
}