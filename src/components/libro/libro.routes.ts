import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import * as controller from './libro.controller';

export const libroRouter = Router();
libroRouter.get('/', controller.getAll);
libroRouter.get('/:id', controller.getById);
libroRouter.post('/', requireAuth, controller.create);
libroRouter.put('/:id', requireAuth, controller.update);
libroRouter.delete('/:id', requireAuth, controller.remove);
