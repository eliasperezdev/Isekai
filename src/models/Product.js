import sequelize from "sequelize";
import db from "../database/config.js";
import Category from "./Category.js";
import Editorial from "./Editorial.js";

const Product = db.define("Product", {
	name: {
		type: sequelize.STRING,
		allowNull: false,
	},
	price: {
		type: sequelize.FLOAT,
		allowNull: false,
	},
    stock: {
        type: sequelize.INTEGER,
        allowNull: false
    },    
    description: {
        type: sequelize.STRING,
        allowNull: false
    },    
    condition: {
        type: sequelize.BOOLEAN,
        allowNull: false
    },    
    descuento: {
        type: sequelize.FLOAT,
        allowNull: false
    },
    recommend: {
      type: sequelize.BOOLEAN,
      allowNull: false
    },
    isbn: {
        type: sequelize.STRING,
      allowNull: true
    },
    urlImage: {
        type: sequelize.STRING,
        allowNull: false
    },
    EditorialId :{
        type: sequelize.INTEGER,
        allowNull:true
    }
});

export default Product;