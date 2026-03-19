import { Router } from 'express';
import contentRoutes from './fs.content.route';
import structureRoutes from './fs.structure.route';
import watcherRoutes from './fs.watcher.route';

const fsRouter = Router();

fsRouter.use('/', contentRoutes);
fsRouter.use('/', structureRoutes);
fsRouter.use('/', watcherRoutes);

export default fsRouter;