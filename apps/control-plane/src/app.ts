import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.route';
import workspaceRoutes from './routes/workspace.route';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/workspaces', workspaceRoutes);

export { app }; 