import sequelize from "sequelize";
import db from "../database/config.js";
import Order from "./Order.js";
import Product from "./Product.js";

const OrderDetails = db.define("OrderDetails", {
	quantity: {
		type: sequelize.INTEGER,
		allowNull: false,
	},
    price: {
        type: sequelize.STRING,
        allowNull: false
    },
    discount: {
        type: sequelize.FLOAT,
        allowNull: false
    }
});

export default OrderDetails;