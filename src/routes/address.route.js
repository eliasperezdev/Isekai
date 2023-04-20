import { Router } from 'express';
import validateToken from '../middlewares/authenticateToken.js';
import { addAddress, deleteAddress, getAddress, getAddresses } from '../controllers/Address.controller.js';

const routerAddress = Router();

routerAddress.post('/',validateToken, addAddress)
routerAddress.get('/',validateToken, getAddresses)
routerAddress.get('/:idAddress', getAddress)
routerAddress.delete('/:idAddress', deleteAddress)

export default routerAddress;