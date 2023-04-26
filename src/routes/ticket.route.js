

import { Router } from 'express';
import { getTicket } from '../controllers/Ticket.controller.js';

const routerTicket = Router();

routerTicket.get('/:idOrder', getTicket);

export default routerTicket;