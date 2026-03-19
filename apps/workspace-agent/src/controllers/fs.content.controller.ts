import { Request, Response } from 'express';
import { FsService } from '../services/fs.service';

export const getFileTree = async (req: Request, res: Response) => {
    try {
        const tree = await FsService.buildTree();
        res.status(200).json(tree);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const readFile = async (req: Request, res: Response) => {
    try {
        const filePath = req.query.path as string;
        if (!filePath) {
            return res.status(400).json({ error: "Path query parameter is required" });
        }
        
        const content = await FsService.readFile(filePath);
        res.status(200).json({ content });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const writeFile = async (req: Request, res: Response) => {
    try {
        const { path, content } = req.body;
        if (!path || content === undefined) {
            return res.status(400).json({ error: "Path and content are required in the body" });
        }

        await FsService.writeFile(path, content);
        res.status(200).json({ message: "File saved successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};