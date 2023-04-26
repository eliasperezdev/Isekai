
import { Router } from 'express'
import { emailContact } from '../controllers/Email.controller.js';

const routerEmail = Router();

routerEmail.post('/', emailContact)

export default routerEmail;