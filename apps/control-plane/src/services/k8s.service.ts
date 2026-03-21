import * as k8s from '@kubernetes/client-node';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { workspaces } from '../db/schema';
import { randomUUID } from 'crypto';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

export class K8sService {
    public static async createWorkspace(userId: string) {
        const workspaceState = await this.getOrCreateWorkspaceState(userId);
        const workspaceId = workspaceState.id;
        const namespace = workspaceState.namespace;

        const podName = `workspace-${workspaceId}`;
        const serviceName = `${podName}-svc`;

        const podSpec: k8s.V1Pod = {
            metadata: { 
                name: podName,
                labels: { 
                    app: podName,
                    owner: userId 
                } 
            },
            spec: {
                containers: [{
                    name: 'agent',
                    image: 'code-engine-agent',
                    imagePullPolicy: 'IfNotPresent',
                    // 👇 CHANGED: Expose BOTH ports from the container
                    ports: [
                        { containerPort: 8081, name: 'http' },
                        { containerPort: 8082, name: 'terminal' }
                    ],
                    volumeMounts: [{
                        name: 'workspace-storage',
                        mountPath: '/workspace'
                    }]
                }],
                volumes: [{
                    name: 'workspace-storage',
                    persistentVolumeClaim: {
                        claimName: workspaceState.pvcName
                    }
                }]
            }
        };

        const serviceSpec: k8s.V1Service = {
            metadata: { 
                name: serviceName,
                labels: { owner: userId } // Good practice to label the service too
            },
            spec: {
                selector: { app: podName },
                // 👇 CHANGED: Map both ports and request NodePorts for them
                ports: [
                    { port: 8081, targetPort: 8081, name: 'http' },
                    { port: 8082, targetPort: 8082, name: 'terminal' }
                ],
                type: 'NodePort'
            }
        };

        try {
            try {
                await k8sApi.createNamespacedPod(namespace, podSpec);
                console.log(`[K8s] Pod ${podName} created successfully.`);
            } catch (err: any) {
                if (err.body?.reason === 'AlreadyExists' || err.statusCode === 409) {
                    console.log(`[K8s] Pod ${podName} is already running. Resuming...`);
                } else {
                    throw err; 
                }
            }

            let serviceBody;
            try {
                const response = await k8sApi.createNamespacedService(namespace, serviceSpec);
                serviceBody = response.body;
                console.log(`[K8s] Service ${serviceName} created successfully.`);
            } catch (err: any) {
                if (err.body?.reason === 'AlreadyExists' || err.statusCode === 409) {
                    console.log(`[K8s] Service ${serviceName} exists. Fetching details...`);
                    const existingService = await k8sApi.readNamespacedService(serviceName, namespace);
                    serviceBody = existingService.body;
                } else {
                    throw err;
                }
            }
            
            // 👇 CHANGED: Safely extract both NodePorts based on their names
            const servicePorts = serviceBody.spec?.ports;
            if (!servicePorts) throw new Error("Ports were not assigned by Kubernetes.");

            const httpNodePort = servicePorts.find(p => p.name === 'http')?.nodePort;
            const terminalNodePort = servicePorts.find(p => p.name === 'terminal')?.nodePort;

            if (!httpNodePort || !terminalNodePort) {
                throw new Error("NodePorts were not fully assigned.");
            }

            const nodes = await k8sApi.listNode();
            const nodeIp = nodes.body.items[0].status?.addresses?.find(
                (addr) => addr.type === 'InternalIP'
            )?.address || 'localhost';

            // 👇 CHANGED: Return two distinct URLs
            return {
                podName,
                serviceName,
                nodeIp,
                apiUrl: `http://${nodeIp}:${httpNodePort}`,
                wsUrl: `ws://${nodeIp}:${terminalNodePort}` // Now points strictly to 8082!
            };

        } catch (error) {
            console.error(`[K8s Error] Failed to provision/resume workspace ${workspaceId}:`, error);
            throw error;
        }
    }

    private static async getOrCreateWorkspaceState(userId: string) {
        const [existing] = await db.select().from(workspaces).where(eq(workspaces.userId, userId));
        
        if (existing) {
            console.log(`[DB] Found existing workspace for user ${userId}: ${existing.pvcName}`);
            return existing;
        }

        const newWorkspaceId = randomUUID();
        const pvcName = `pvc-workspace-${newWorkspaceId}`;
        const namespace = 'default';

        console.log(`[K8s] Creating new PVC: ${pvcName}`);

        const pvcSpec: k8s.V1PersistentVolumeClaim = {
            metadata: { 
                name: pvcName,
                labels: { owner: userId } 
            },
            spec: {
                accessModes: ['ReadWriteOnce'],
                resources: { requests: { storage: '1Gi' } }
            }
        };

        await k8sApi.createNamespacedPersistentVolumeClaim(namespace, pvcSpec);

        const [newWorkspace] = await db.insert(workspaces).values({
            id: newWorkspaceId,
            userId,
            pvcName,
            namespace,
            status: 'PROVISIONING'
        }).returning();

        return newWorkspace;
    }

    public static async deleteWorkspace(userId: string) {
        const [workspace] = await db.select().from(workspaces).where(eq(workspaces.userId, userId));
        
        if (!workspace) {
            console.log(`[K8s] No workspace found for user ${userId} to delete.`);
            return;
        }

        const namespace = workspace.namespace;
        const podName = `workspace-${workspace.id}`;
        const serviceName = `${podName}-svc`;
        const pvcName = workspace.pvcName;

        console.log(`[K8s] Initiating teardown for user ${userId}...`);

        try {
            await k8sApi.deleteNamespacedPod(podName, namespace);
            console.log(`[K8s] Deleted Pod: ${podName}`);
        } catch (e: any) { if (e.statusCode !== 404) console.error("Pod deletion error:", e.body?.message); }

        try {
            await k8sApi.deleteNamespacedService(serviceName, namespace);
            console.log(`[K8s] Deleted Service: ${serviceName}`);
        } catch (e: any) { if (e.statusCode !== 404) console.error("Service deletion error:", e.body?.message); }

        try {
            await k8sApi.deleteNamespacedPersistentVolumeClaim(pvcName, namespace);
            console.log(`[K8s] Deleted PVC: ${pvcName}`);
        } catch (e: any) { if (e.statusCode !== 404) console.error("PVC deletion error:", e.body?.message); }
    }

    static async stopWorkspace(userId: string) {
        const labelSelector = `owner=${userId}`;

        try {
            await k8sApi.deleteCollectionNamespacedPod(
                'default',
                undefined,
                undefined,
                undefined,
                undefined,
                0, 
                labelSelector
            );

            const services = await k8sApi.listNamespacedService('default', undefined, undefined, undefined, undefined, labelSelector);
            for (const svc of services.body.items) {
                if (svc.metadata?.name) {
                    await k8sApi.deleteNamespacedService(svc.metadata.name, 'default');
                }
            }

            console.log(`Stopped workspace for user: ${userId}. PVC preserved.`);
            return { success: true };
        } catch (error) {
            console.error('Error stopping workspace:', error);
            throw error;
        }
    }

    static async getPodByOwner(userId: string) {
        const labelSelector = `owner=${userId}`;
        const response = await k8sApi.listNamespacedPod('default', undefined, undefined, undefined, undefined, labelSelector);
        return response.body.items[0] || null;
    }
}