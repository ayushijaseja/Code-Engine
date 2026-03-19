import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app'; 
import fs from 'fs/promises';
import path from 'path';

describe('Workspace Agent API Integration Tests', () => {
    
    const TEST_WORKSPACE = path.join(process.cwd(), 'test-workspace-api');

    beforeAll(async () => {
        process.env.WORKSPACE_DIR = TEST_WORKSPACE;
        await fs.mkdir(TEST_WORKSPACE, { recursive: true });
    });

    afterAll(async () => {
        await fs.rm(TEST_WORKSPACE, { recursive: true, force: true });
    });

    // Health Check
    it('should return 200 OK for the health check', async () => {
        const response = await request(app).get('/api/health');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'Agent is healthy!' });
    });

    // Create File
    it('should create a new file via POST /api/fs/create', async () => {
        const response = await request(app)
            .post('/api/fs/create')
            .send({ path: '/test-file.txt', type: 'file' });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('file created successfully');
    });

    // Write in File
    it('should write content to the file via PUT /api/fs/write', async () => {
        const response = await request(app)
            .put('/api/fs/write')
            .send({ 
                path: '/test-file.txt', 
                content: 'console.log("Automated testing is awesome!");' 
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('File saved successfully');
    });

    // Read File
    it('should read the file content via GET /api/fs/read', async () => {
        const response = await request(app).get('/api/fs/read?path=/test-file.txt');
        
        expect(response.status).toBe(200);
        expect(response.body.content).toBe('console.log("Automated testing is awesome!");');
    });

    // Get Folder Structure 
    it('should list the file in the directory tree via GET /api/fs/tree', async () => {
        const response = await request(app).get('/api/fs/tree');
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        
        const fileExists = response.body.some((node: any) => node.name === 'test-file.txt');
        expect(fileExists).toBe(true);
    });

    // Rename File
    it('should rename the file via PUT /api/fs/rename', async () => {
        const response = await request(app)
            .put('/api/fs/rename')
            .send({ 
                oldPath: '/test-file.txt', 
                newPath: '/renamed-file.txt' 
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Renamed successfully');
    });

    // Delete File
    it('should delete the file via DELETE /api/fs/delete', async () => {
        const response = await request(app).get('/api/fs/delete?path=/renamed-file.txt');
        
        const deleteResponse = await request(app)
            .delete('/api/fs/delete')
            .query({ path: '/renamed-file.txt' });

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.message).toBe('Deleted successfully');
    });

    // Not allowed
    it('should block path traversal hacks', async () => {
        const response = await request(app).get('/api/fs/read?path=../../../etc/passwd');
        
        expect(response.status).toBe(500);
        expect(response.body.error).toContain('Access Denied: Path Traversal Detected');
    });
});