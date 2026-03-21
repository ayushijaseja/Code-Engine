import { eq } from 'drizzle-orm';
import { db } from '../db';
import { workspaces } from '../db/schema';

type CreateWorkspaceDTO = typeof workspaces.$inferInsert;

type WorkspaceStatus = typeof workspaces.$inferSelect.status;

export class WorkspaceRepository {
    static async findByUserId(userId: string) {
        const [workspace] = await db.select().from(workspaces).where(eq(workspaces.userId, userId));
        return workspace;
    }

    static async create(data: CreateWorkspaceDTO) {
        const [newWorkspace] = await db.insert(workspaces).values(data).returning();
        return newWorkspace;
    }

    static async updateStatus(workspaceId: string, status: WorkspaceStatus) {
        await db.update(workspaces)
            .set({ status }) 
            .where(eq(workspaces.id, workspaceId));
    }

    static async deleteById(workspaceId: string) {
        await db.delete(workspaces).where(eq(workspaces.id, workspaceId));
    }
}