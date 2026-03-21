import { randomUUID } from 'crypto';
import { WorkspaceRepository } from '../repositories/workspace.repository';
import { generatePodSpec, generatePvcSpec, generateServiceSpec } from '../k8s/k8s.manifest';
import { generateIngressSpec } from './k8s.manifest';
import { K8sClient } from './k8s.client';

export class WorkspaceService {
    public static async createWorkspace(userId: string) {
        const workspaceState = await this.getOrCreateWorkspaceState(userId);
        const { id: workspaceId, namespace, pvcName } = workspaceState;

        const podName = `workspace-${workspaceId}`;
        const serviceName = `${podName}-svc`;
        const baseDomain = process.env.BASE_DOMAIN || 'code-engine.dev'; // Your actual cloud domain

        const podSpec = generatePodSpec(podName, userId, pvcName);
        const serviceSpec = generateServiceSpec(serviceName, podName, userId);
        const ingressSpec = generateIngressSpec(workspaceId, serviceName, userId, baseDomain);

        try {
            await K8sClient.applyPod(namespace, podSpec);
            await K8sClient.applyService(namespace, serviceSpec);

            // Apply the new Ingress routing
            await K8sClient.applyIngress(namespace, ingressSpec);

            await WorkspaceRepository.updateStatus(workspaceId, 'RUNNING');

            const workspaceHost = `ws-${workspaceId}.${baseDomain}`;

            return {
                podName,
                serviceName,
                apiUrl: `https://${workspaceHost}`,
                wsUrl: `wss://${workspaceHost}/terminal`
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