import {
    addOrder,
    getOrdensUser,
    getOrden,
    getOrdens,
    getFeedback,
    updateStatus,
    getOrdensFinished
} from '../controllers/Order.controller.js';

import { Router } from 'express';
import validateToken from '../middlewares/authenticateToken.js';
import verifyAdmin from '../middlewares/verifyAdmin.js';

const routerOrder = Router();

routerOrder.post('/', addOrder)
routerOrder.post('/status/:id', updateStatus)
routerOrder.post('/feedback', getFeedback)
routerOrder.get('/',validateToken, getOrdens)
routerOrder.get('/finished',validateToken, getOrdensFinished)
routerOrder.get('/user/',validateToken, getOrdensUser)
routerOrder.get('/order/:idOrder', getOrden)

export default routerOrder;