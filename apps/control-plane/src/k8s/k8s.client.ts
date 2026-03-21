import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

export class K8sClient {
    static async applyPod(namespace: string, podSpec: k8s.V1Pod) {
        const podName = podSpec.metadata!.name!;
        try {
            await k8sApi.createNamespacedPod(namespace, podSpec);
            console.log(`[K8s] Pod ${podName} created.`);
        } catch (err: any) {
            if (err.body?.reason !== 'AlreadyExists' && err.statusCode !== 409) throw err;
            console.log(`[K8s] Pod ${podName} is already running.`);
        }
    }

    static async applyService(namespace: string, serviceSpec: k8s.V1Service) {
        const serviceName = serviceSpec.metadata!.name!;
        try {
            const response = await k8sApi.createNamespacedService(namespace, serviceSpec);
            console.log(`[K8s] Service ${serviceName} created.`);
            return response.body;
        } catch (err: any) {
            if (err.body?.reason !== 'AlreadyExists' && err.statusCode !== 409) throw err;
            console.log(`[K8s] Service ${serviceName} exists. Fetching...`);
            const existing = await k8sApi.readNamespacedService(serviceName, namespace);
            return existing.body;
        }
    }

    static async applyPvc(namespace: string, pvcSpec: k8s.V1PersistentVolumeClaim) {
        try {
            await k8sApi.createNamespacedPersistentVolumeClaim(namespace, pvcSpec);
        } catch (err: any) {
            if (err.body?.reason !== 'AlreadyExists' && err.statusCode !== 409) throw err;
        }
    }

    static async getNodeIp(): Promise<string> {
        const nodes = await k8sApi.listNode();
        return nodes.body.items[0].status?.addresses?.find(
            (addr) => addr.type === 'InternalIP'
        )?.address || 'localhost';
    }

    static async deletePod(name: string, namespace: string) {
        try {
            await k8sApi.deleteNamespacedPod(name, namespace);
            console.log(`[K8s] Deleted Pod: ${name}`);
        } catch (e: any) {
            if (e.statusCode !== 404) console.error(`[K8s Error] Pod deletion failed:`, e.body?.message);
        }
    }

    static async deleteService(name: string, namespace: string) {
        try {
            await k8sApi.deleteNamespacedService(name, namespace);
            console.log(`[K8s] Deleted Service: ${name}`);
        } catch (e: any) {
            if (e.statusCode !== 404) console.error(`[K8s Error] Service deletion failed:`, e.body?.message);
        }
    }

    static async deletePvc(name: string, namespace: string) {
        try {
            await k8sApi.deleteNamespacedPersistentVolumeClaim(name, namespace);
            console.log(`[K8s] Deleted PVC: ${name}`);
        } catch (e: any) {
            if (e.statusCode !== 404) console.error(`[K8s Error] PVC deletion failed:`, e.body?.message);
        }
    }
}