import {
    authMe,
    login
} from '../controllers/Auth.controller.js';

import { Router } from 'express';
import validateToken from '../middlewares/authenticateToken.js';

const routerAuth = Router();

routerAuth.post('/', login)
routerAuth.get('/',validateToken ,authMe)

export default routerAuth;