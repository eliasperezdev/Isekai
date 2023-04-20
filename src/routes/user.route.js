import {
    getUsers,
    addUser,
    getSeller,
    updateRole,
    getUser,
    getUserDNI
} from '../controllers/User.controller.js';

import { Router } from 'express';
import validateToken from '../middlewares/authenticateToken.js';
import verifyAdmin from '../middlewares/verifyAdmin.js';
import verifyAdmistrador from '../middlewares/verifyAdministrador.js';

const routerUser = Router();

routerUser.get('/',validateToken, verifyAdmin, getUsers);
routerUser.get('/user/:id', getUser);
routerUser.get('/dni/:id', getUserDNI);
routerUser.get('/seller',validateToken, verifyAdmin, getSeller);
routerUser.post('/', addUser)
routerUser.post('/updateRole/:id',validateToken,verifyAdmistrador,updateRole)

export default routerUser;