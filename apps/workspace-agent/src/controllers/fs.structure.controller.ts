import { Request, Response } from 'express';
import { FsService } from '../services/fs.service';

export const createNode = async (req: Request, res: Response) => {
    try {
        const { path, type } = req.body;
        if (!path || !['file', 'directory'].includes(type)) {
            return res.status(400).json({ error: "Valid path and type ('file'|'directory') are required" });
        }
        await FsService.create(path, type);
        res.status(201).json({ message: `${type} created successfully` });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteNode = async (req: Request, res: Response) => {
    try {
        const filePath = req.query.path as string;
        if (!filePath) {
            return res.status(400).json({ error: "Path query parameter is required" });
        }
        await FsService.delete(filePath);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const renameNode = async (req: Request, res: Response) => {
    try {
        const { oldPath, newPath } = req.body;
        if (!oldPath || !newPath) {
            return res.status(400).json({ error: "oldPath and newPath are required in the body" });
        }
        await FsService.rename(oldPath, newPath);
        res.status(200).json({ message: "Renamed successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};