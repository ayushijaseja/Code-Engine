import * as k8s from '@kubernetes/client-node';

export const generatePodSpec = (podName: string, userId: string, pvcName: string): k8s.V1Pod => ({
    metadata: { name: podName, labels: { app: podName, owner: userId } },
    spec: {
        containers: [{
            name: 'agent',
            // Must point to your public/private registry now
            image: 'docker.io/yourusername/code-engine-agent:latest', 
            imagePullPolicy: 'Always', 
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
    metadata: { name: serviceName, labels: { owner: userId } },
    spec: {
        selector: { app: podName },
        ports: [
            { port: 8081, targetPort: 8081, name: 'http' },
            { port: 8082, targetPort: 8082, name: 'terminal' }
        ],
        // Secure internal networking only
        type: 'ClusterIP' 
    }
});

//  The Ingress Controller configuration
export const generateIngressSpec = (workspaceId: string, serviceName: string, userId: string, baseDomain: string): k8s.V1Ingress => ({
    metadata: {
        name: `ingress-${workspaceId}`,
        labels: { owner: userId },
        annotations: {
            // Tells NGINX to upgrade WebSocket connections automatically
            'nginx.ingress.kubernetes.io/websocket-services': serviceName,
        }
    },
    spec: {
        ingressClassName: 'nginx',
        rules: [{
            // Creates a unique, URL for this workspace
            host: `ws-${workspaceId}.${baseDomain}`,
            http: {
                paths: [
                    {
                        path: '/terminal',
                        pathType: 'Prefix',
                        backend: {
                            service: { name: serviceName, port: { number: 8082 } }
                        }
                    },
                    {
                        path: '/',
                        pathType: 'Prefix',
                        backend: {
                            service: { name: serviceName, port: { number: 8081 } }
                        }
                    }
                ]
            }
        }]
    }
});