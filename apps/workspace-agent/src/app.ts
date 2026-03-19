import express from 'express';
import cors from 'cors';
import fsRoutes from './routes/fs.index.route';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/fs', fsRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'Agent is healthy!' });
});

export default app;