import sequelize from "sequelize";
import db from "../database/config.js";
import Role from "./Role.js";

const User = db.define("User", {
	name: {
		type: sequelize.STRING,
		allowNull: false,
	},
	lastName: {
		type: sequelize.STRING,
		allowNull: false,
	},
    password: {
        type: sequelize.STRING,
        allowNull: true
    },    
    email: {
        type: sequelize.STRING,
        allowNull: false
    },    
    phone: {
        type: sequelize.STRING,
        allowNull: true
    },    
    dni: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    isClient: {
        type: sequelize.BOOLEAN,
        allowNull: false
    }
});

export default User;