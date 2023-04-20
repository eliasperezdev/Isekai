
import { Router } from 'express'
import { paymentMP } from '../controllers/Payment.controller.js';

const routerPayment = Router();

routerPayment.post('/', paymentMP)

export default routerPayment;