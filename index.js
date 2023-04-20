import express from "express"
import db from "./src/database/config.js"
//import Address from "./models/Address.js";
//import Category from "./models/Category.js";
//import Editorial from "./models/Editorial.js";
//import Favorite from "./models/Favorite.js";
//import Order from "./models/Order.js";
//import OrderDetails from "./models/orderDetails.js";
import Product from "./src/models/Product.js";
//import Role from "./models/Role.js";
import User from "./src/models/User.js";
//import Ticket from "./models/Ticket.js";
import "./src/models/asociations.js"
import dotenv from 'dotenv'
import routerEditorial from "./src/routes/editorial.route.js";
import routerCategory from "./src/routes/category.route.js";
import routerProduct from "./src/routes/product.route.js";
import routerUser from "./src/routes/user.route.js";
import routerAuth from "./src/routes/auth.route.js";
import cors from 'cors'
import routerOrder from "./src/routes/order.route.js";
import routerPayment from "./src/routes/payment.route.js";
import routerFavorities from "./src/routes/favorite.route.js";
import routerAddress from "./src/routes/address.route.js";
import { dashboard } from "./src/controllers/Category.controller.js";

const app = express()
app.use(express.json())
dotenv.config()

const corsOptions ={
    origin:'*', 
    optionSuccessStatus:200,
 }
 
 app.use(cors(corsOptions))

//routes
app.use('/api/editorials', routerEditorial);
app.use('/api/categories', routerCategory);
app.use('/api/products', routerProduct);
app.use('/api/users', routerUser);
app.use('/api/favorities', routerFavorities);
app.use('/api/login', routerAuth);
app.use('/api/orders', routerOrder);
app.use('/api/address', routerAddress);
app.use('/api/payment', routerPayment);
app.use('/api/dashboard', dashboard);

const PORT = process.env.PORT || 4000

db.sync({ force: false })
    .then(()=>console.log("Base de datos conectada"))
    .catch((error) => console.log(error))

app.listen(PORT,  ()=> {
    console.log(`Servidor corriendo en ${PORT}`);
})
