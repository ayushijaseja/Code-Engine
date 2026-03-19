import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import app from './app';
import { setupTerminalWebSocket } from './ws/terminal.ws';

const PORT = process.env.PORT || 8081;

const server = createServer(app);

const web_socket_server = new WebSocketServer({ server });

setupTerminalWebSocket(web_socket_server);

server.listen(PORT, () => {
    console.log(`🚀 Workspace Agent running on port ${PORT}`);
});