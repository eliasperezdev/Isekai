import sequelize from "sequelize";
import db from "../database/config.js";

const Role = db.define("Role", {
	name: {
		type: sequelize.STRING,
		allowNull: false,
	}
});

export default Role;