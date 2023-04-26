import { Router } from 'express';
import { bestProducts, reportClients, reportMonth, reportWeek } from '../controllers/reporter.controller.js';

const reporterRoute = Router();

reporterRoute.get('/week', reportWeek);
reporterRoute.get('/month', reportMonth);
reporterRoute.get('/clients', reportClients);
reporterRoute.get('/bestproduct', bestProducts);

export default reporterRoute;