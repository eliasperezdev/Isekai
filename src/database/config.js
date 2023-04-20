import Sequelize from "sequelize"
import 'dotenv/config'
import mysql2 from 'mysql2'; // Needed to fix sequelize issues with WebPack

const db = new Sequelize(
    process.env.DATABASE_NAME_DATABASE,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
        dialect: 'mysql',
        dialectModule: mysql2, // Needed to fix sequelize issues with WebPack
        host: process.env.DB_HOST
    })


export default db