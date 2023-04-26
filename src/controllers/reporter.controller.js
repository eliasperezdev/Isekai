import fs from 'fs';
import PDFDocument from 'pdfkit'
import path from "path";
import { fileURLToPath } from 'url';
import Order from '../models/Order.js';
import OrderDetails from '../models/orderDetails.js';
import Product from '../models/Product.js';
import { Op } from 'sequelize';
const __dirname = path.dirname(fileURLToPath(import.meta.url));



const reportMonth = async () => {

}

const reportWeek = async () => {
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));

    const orders = await Order.findAll({
        where: {
          createdAt: {
            [Op.gte]: startOfWeek,
            [Op.lte]: endOfWeek,
          },
        },
        include: [
          {
            model: OrderDetails,
            include: [Product],
          },
        ],
      });

      
      
      return console.log("reporte generado");
}

const reportClients = async () => {
    
}

const bestProducts = async () => {
    
}

export {
    reportClients,
    reportMonth,
    reportWeek,
    bestProducts
}