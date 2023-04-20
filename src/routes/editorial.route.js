import {
    getEditorials,
    addEditorial,
    editEditorial,
    deleteEditorial
} from '../controllers/Editorial.controller.js';

import { Router } from 'express';
import verifyAdmin from '../middlewares/verifyAdmin.js';
import validateToken from '../middlewares/authenticateToken.js';

const routerEditorial = Router();

routerEditorial.get('/', getEditorials);
routerEditorial.post('/',validateToken, verifyAdmin, addEditorial)
routerEditorial.put('/:idEditorial',validateToken, verifyAdmin, editEditorial);
routerEditorial.delete('/:idEditorial',validateToken, verifyAdmin, deleteEditorial);

export default routerEditorial;