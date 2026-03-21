import { randomUUID } from 'crypto';
import { K8sClient } from '../k8s/k8s.client';
import { WorkspaceRepository } from '../repositories/workspace.repository';
import { generatePodSpec, generatePvcSpec, generateServiceSpec } from '../k8s/k8s.manifest';

export class WorkspaceService {
    public static async createWorkspace(userId: string) {
        const workspaceState = await this.getOrCreateWorkspaceState(userId);
        const { id: workspaceId, namespace, pvcName } = workspaceState;

        const podName = `workspace-${workspaceId}`;
        const serviceName = `${podName}-svc`;

        const podSpec = generatePodSpec(podName, userId, pvcName);
        const serviceSpec = generateServiceSpec(serviceName, podName, userId);

        try {
            await K8sClient.applyPod(namespace, podSpec);
            const serviceBody = await K8sClient.applyService(namespace, serviceSpec);

            const servicePorts = serviceBody.spec?.ports;
            if (!servicePorts) throw new Error("Ports were not assigned by Kubernetes.");

            const httpNodePort = servicePorts.find(p => p.name === 'http')?.nodePort;
            const terminalNodePort = servicePorts.find(p => p.name === 'terminal')?.nodePort;

            if (!httpNodePort || !terminalNodePort) {
                throw new Error("NodePorts were not fully assigned.");
            }

            const nodeIp = await K8sClient.getNodeIp();
            
            await WorkspaceRepository.updateStatus(workspaceId, 'RUNNING');

            return {
                podName,
                serviceName,
                nodeIp,
                apiUrl: `http://${nodeIp}:${httpNodePort}`,
                wsUrl: `ws://${nodeIp}:${terminalNodePort}`
            };

        } catch (error) {
            console.error(`[Workspace Error] Failed to provision ${workspaceId}:`, error);
            throw error;
        }
    }

    private static async getOrCreateWorkspaceState(userId: string) {
        const existing = await WorkspaceRepository.findByUserId(userId);
        if (existing) return existing;

        const newWorkspaceId = randomUUID();
        const pvcName = `pvc-workspace-${newWorkspaceId}`;
        const namespace = 'default';

        const pvcSpec = generatePvcSpec(pvcName, userId);
        await K8sClient.applyPvc(namespace, pvcSpec);

        const newWorkspace = await WorkspaceRepository.create({
            id: newWorkspaceId,
            userId,
            pvcName,
            namespace,
            status: 'PROVISIONING'
        });

        return newWorkspace;
    }

    public static async stopWorkspace(userId: string) {
        const workspace = await WorkspaceRepository.findByUserId(userId);
        
        if (!workspace) {
            console.log(`[Workspace] No workspace found for user ${userId} to stop.`);
            return { success: false, message: "Workspace not found." };
        }

        const podName = `workspace-${workspace.id}`;
        const serviceName = `${podName}-svc`;
        const namespace = workspace.namespace;

        try {
            await K8sClient.deletePod(podName, namespace);
            await K8sClient.deleteService(serviceName, namespace);

            await WorkspaceRepository.updateStatus(workspace.id, 'STOPPED');

            console.log(`[Workspace] Stopped workspace for user: ${userId}. PVC preserved.`);
            return { success: true };
        } catch (error) {
            console.error(`[Workspace Error] Error stopping workspace for ${userId}:`, error);
            throw error;
        }
    }

    public static async deleteWorkspace(userId: string) {
        const workspace = await WorkspaceRepository.findByUserId(userId);
        
        if (!workspace) {
            console.log(`[Workspace] No workspace found for user ${userId} to delete.`);
            return { success: false, message: "Workspace not found." };
        }

        const podName = `workspace-${workspace.id}`;
        const serviceName = `${podName}-svc`;
        const pvcName = workspace.pvcName;
        const namespace = workspace.namespace;

        console.log(`[Workspace] Initiating total teardown for user ${userId}...`);

        try {
            await K8sClient.deletePod(podName, namespace);
            await K8sClient.deleteService(serviceName, namespace);
            await K8sClient.deletePvc(pvcName, namespace);

            await WorkspaceRepository.deleteById(workspace.id);

            console.log(`[Workspace] Successfully deleted all resources for user ${userId}`);
            return { success: true };
        } catch (error) {
            console.error(`[Workspace Error] Failed to delete workspace for user ${userId}:`, error);
            throw error;
        }
    }
}