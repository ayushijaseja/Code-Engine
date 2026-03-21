import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import app from './app';
import { setupTerminalWebSocket } from './ws/terminal.ws';

const HTTP_PORT = Number(process.env.PORT) || 8081;
const WS_PORT = Number(process.env.WS_PORT) || 8082; 

const server = createServer(app);

server.listen(HTTP_PORT, '0.0.0.0', () => {
    console.log(`🌐 HTTP & Proxy Server running on port ${HTTP_PORT}`);
});

const web_socket_server = new WebSocketServer({ port: WS_PORT, host: '0.0.0.0' }, () => {
    console.log(`💻 Terminal WS Server running on port ${WS_PORT}`);
});

setupTerminalWebSocket(web_socket_server);