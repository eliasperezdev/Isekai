import { Router } from 'express';
import { addFavorite, deleteFavorite, getFavorities } from '../controllers/Favorite.controller.js';
import validateToken from '../middlewares/authenticateToken.js';

const routerFavorities = Router();

routerFavorities.post('/',validateToken, addFavorite)
routerFavorities.get('/',validateToken, getFavorities)
routerFavorities.delete('/:idFavorite', deleteFavorite)

export default routerFavorities;