import Sequelize from "sequelize"
import 'dotenv/config'
const db = new Sequelize(
    process.env.DATABASE_NAME_DATABASE,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
    host:process.env.DATABASE_HOST,
    dialect: 'mysql',
})

export default db