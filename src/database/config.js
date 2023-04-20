import Sequelize from "sequelize"
import 'dotenv/config'

const db = new Sequelize(
    process.env.DATABASE_NAME_DATABASE,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
        dialect: 'mysql',
        dialectModule: require('mysql2'), // Needed to fix sequelize issues with WebPack
        host: process.env.DB_HOST
    })


export default db