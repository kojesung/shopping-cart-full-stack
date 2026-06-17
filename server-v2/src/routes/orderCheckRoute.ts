import { Router } from 'express';
import {
  postOrderCheck,
  getOrderCheck,
  getOrderCheckPayInfo,
  patchRemoteAreaSelection,
} from '../controllers/OrderCheckController.js';

const orderCheckRouter = Router();

orderCheckRouter.post('/order-check', postOrderCheck);
orderCheckRouter.get('/order-check', getOrderCheck);
orderCheckRouter.get('/order-check/pay-info', getOrderCheckPayInfo);
orderCheckRouter.patch('/order-check/select/remote-areas', patchRemoteAreaSelection);

export default orderCheckRouter;
