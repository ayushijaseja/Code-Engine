import express from 'express';
import cors from 'cors';
import fsRoutes from './routes/fs.index.route';
import { dynamicProxyHandler } from './middleware/proxy.middleware';

const app = express();

app.use(cors());

app.use('/proxy/:port', dynamicProxyHandler);

app.use(express.json());

app.use('/api/fs', fsRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'Agent is healthy!' });
});

export default app;