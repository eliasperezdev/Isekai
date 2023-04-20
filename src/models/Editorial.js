import sequelize from "sequelize";
import db from "../database/config.js";

const Editorial = db.define("Editorial", {
	name: {
		type: sequelize.STRING,
		allowNull: false,
	},
});

export default Editorial;