import sequelize from "sequelize";
import db from "../database/config.js";

const Category = db.define("Category", {
	name: {
		type: sequelize.STRING,
		allowNull: false,
	},
    description: {
        type: sequelize.STRING,
        allowNull: false
    },    
    condition: {
        type: sequelize.BOOLEAN,
        allowNull: false
    },    
    urlImage: {
        type: sequelize.STRING,
        allowNull: false
    }
});

export default Category;