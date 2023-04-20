import sequelize from "sequelize";
import db from "../database/config.js";

const Favorite = db.define("Favorite", {
    date: {
        type: sequelize.INTEGER,
      }
});

export default Favorite;