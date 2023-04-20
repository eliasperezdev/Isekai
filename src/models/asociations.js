import db from "../database/config.js";
import Address from "./Address.js";
import Category from "./Category.js";
import Editorial from "./Editorial.js";
import Favorite from "./Favorite.js";
import Order from "./Order.js";
import OrderDetails from "./orderDetails.js";
import Product from "./Product.js";
import Role from "./Role.js";
import Ticket from "./Ticket.js";
import User from "./User.js";

Category.hasMany(Product)
Editorial.hasMany(Product)
User.belongsTo(Role)
User.hasMany(Order)
Order.belongsTo(User)
Order.belongsTo(Address)
Order.belongsTo(Ticket)
Order.hasMany(OrderDetails)
User.hasMany(Favorite)
Product.hasMany(Favorite)
Favorite.belongsTo(Product)
User.hasMany(Address)
Product.hasMany(OrderDetails)
OrderDetails.belongsTo(Product)
OrderDetails.belongsTo(Order)

Product.belongsTo(Category)
Product.belongsTo(Editorial)
