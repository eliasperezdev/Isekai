import {
    getCategories,
    addCategory,
    editCategory,
    deleteCategory
} from '../controllers/Category.controller.js';

import { Router } from 'express';
import verifyAdmin from '../middlewares/verifyAdmin.js';
import validateToken from '../middlewares/authenticateToken.js';
import multer from 'multer';
//import upload from '../services/multer.js';
const upload = multer({ dest: '../uploads' })

const routerCategory = Router();

routerCategory.get('/', getCategories);
routerCategory.post('/',validateToken, verifyAdmin,upload.single('file'), addCategory)
routerCategory.put('/:idCategory',validateToken, verifyAdmin, editCategory);

export default routerCategory;