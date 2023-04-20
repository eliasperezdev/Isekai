import sequelize from "sequelize";
import db from "../config/db.js";

const Shipment = db.define("Shipment", {
    ordenId: {
        type: DataTypes.INTEGER,
        references: {
          model: Order,
          key: 'id'
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: User,
          key: 'id'
        }
      }
});

export default Shipment;