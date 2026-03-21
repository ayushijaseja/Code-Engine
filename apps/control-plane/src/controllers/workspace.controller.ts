import { Request, Response } from 'express';
import { WorkspaceService } from '../services/workspace.service';

export const stopWorkspace = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: No user ID found' });
    }

    console.log(`[Control Plane] Stopping workspace for user: ${userId}`);

    await WorkspaceService.stopWorkspace(userId);

    return res.status(200).json({
      success: true,
      message: 'Workspace compute resources released. Storage preserved.',
      details: { userId, timestamp: new Date().toISOString() }
    });
  } catch (error) {
    console.error('Stop Workspace Error:', error);
    return res.status(500).json({ 
      error: 'Failed to stop workspace',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const launchWorkspace = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        
        console.log(`[User: ${userId}] requested to launch/resume workspace`);

        const k8sDetails = await WorkspaceService.createWorkspace(userId);

        res.status(200).json({
            message: "Workspace ready",
            details: k8sDetails
        });

    } catch (error) {
        console.error("Workspace Launch Error:", error);
        res.status(500).json({ error: "Failed to provision workspace" });
    }
};