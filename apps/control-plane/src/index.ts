import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.route';
import workspaceRoutes from './routes/workspace.route';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/workspaces', workspaceRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Control Plane running on http://localhost:${PORT}`);
});

export { app }; 