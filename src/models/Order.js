import sequelize from "sequelize";
import db from "../database/config.js";
import Category from "./Category.js";

const Order = db.define("Order", {
    dateTime: {
        type: sequelize.DATE,
        allowNull: false
    },    
    tax: {
        type: sequelize.FLOAT,
        allowNull: false
    },    
    totalSale: {
        type: sequelize.FLOAT,
        allowNull: false
    },
    // En proceso, Preparado, Entregado, enviado, no enviado
    status: {
        type: sequelize.STRING,
        allowNull: false
    },
    UserId: {
        type: sequelize.INTEGER,
        allowNull: true
    },
    AddressId: {
        type: sequelize.INTEGER,
        allowNull: true
    },
    additionalData: {
        type: sequelize.STRING,
        allowNull: true
    },
    preferenceId: {
        type: sequelize.STRING,
        allowNull: false
    }
});

export default Order;