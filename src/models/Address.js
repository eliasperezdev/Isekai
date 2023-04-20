import sequelize from "sequelize";
import db from "../database/config.js";
import User from "./User.js";

const Address = db.define("Address", {
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
	location: {
		type: sequelize.STRING,
		allowNull: false,
	},
    province: {
        type: sequelize.STRING,
        allowNull: false
    },    
    postalCode: {
        type: sequelize.STRING,
        allowNull: false
    },    
    street: {
        type: sequelize.STRING,
        allowNull: false
    },
    altitude: {
        type: sequelize.INTEGER,
        allowNull: false
    },    
    department: {
        type: sequelize.STRING,
        allowNull: true
    },
});

export default Address;