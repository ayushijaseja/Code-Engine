import { WebSocketServer, WebSocket } from 'ws';
import { PtyService } from '../services/pty.service';

export function setupTerminalWebSocket(wss: WebSocketServer) {
    wss.on('connection', (ws: WebSocket) => {
        console.log('Terminal WebSocket connected');
        
        const ptyService = new PtyService();

        ptyService.read((data) => {
            ws.send(data);
        });

        ws.on('close', () => {
            console.log('Terminal WebSocket disconnected');
            ptyService.kill();
        });

        ws.on('message', (message) => {
            try {
                const payload = JSON.parse(message.toString());

                if (payload.type === 'resize') {
                    ptyService.resize(payload.cols, payload.rows);
                } 
                else if (payload.type === 'input') {
                    ptyService.write(payload.data);
                }
            } catch (error) {
                ptyService.write(message.toString());
            }
        });
    });
}