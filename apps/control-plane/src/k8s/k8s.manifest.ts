import * as k8s from '@kubernetes/client-node';

export const generatePodSpec = (podName: string, userId: string, pvcName: string): k8s.V1Pod => ({
    metadata: { 
        name: podName,
        labels: { app: podName, owner: userId } 
    },
    spec: {
        containers: [{
            name: 'agent',
            image: 'code-engine-agent',
            imagePullPolicy: 'IfNotPresent',
            ports: [
                { containerPort: 8081, name: 'http' },
                { containerPort: 8082, name: 'terminal' }
            ],
            volumeMounts: [{ name: 'workspace-storage', mountPath: '/workspace' }]
        }],
        volumes: [{
            name: 'workspace-storage',
            persistentVolumeClaim: { claimName: pvcName }
        }]
    }
});

export const generateServiceSpec = (serviceName: string, podName: string, userId: string): k8s.V1Service => ({
    metadata: { 
        name: serviceName,
        labels: { owner: userId } 
    },
    spec: {
        selector: { app: podName },
        ports: [
            { port: 8081, targetPort: 8081, name: 'http' },
            { port: 8082, targetPort: 8082, name: 'terminal' }
        ],
        type: 'NodePort'
    }
});

export const generatePvcSpec = (pvcName: string, userId: string): k8s.V1PersistentVolumeClaim => ({
    metadata: { 
        name: pvcName,
        labels: { owner: userId } 
    },
    spec: {
        accessModes: ['ReadWriteOnce'],
        resources: { requests: { storage: '1Gi' } }
    }
});