import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import OrderDetails from "../models/orderDetails.js";
import fs from 'fs';
import PDFDocument from 'pdfkit'
import path from "path";
import { fileURLToPath } from 'url';
import { transporter } from "../services/mailer.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const getTicket = async (req, res ) => {
    const { idOrder } = req.params;

    const order = await Order.findOne({where: {id: idOrder}, include: [{model: OrderDetails, include: [Product]}, User]})
    // Calcular el total de la factura con descuentos en los productos
    const total = order.totalSale
    const customerName = order.User.name + " " + order.User.lastName
    const dateTime = new Date()
    const tax = order.tax
    const status = "Generado"

    const products= order.OrderDetails.map(prod => prod)
    console.log(products);
    // Crear la factura en la base de datos
    const invoice = await Ticket.create({ 
        numberTicket: 1,
        dateTime: dateTime,
        tax: tax,
        totalSale: total,
        status: status
     });   



     console.log(invoice);
    // Generar el archivo PDF de la factura
    const doc = new PDFDocument();
    const filename = `invoice-${invoice.id}.pdf`;
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    doc.pipe(fs.createWriteStream(filePath));
  
    doc.fontSize(18).text(`Factura #${invoice.id}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Cliente: ${customerName}`);
    doc.moveDown();
    doc.fontSize(12).text('Productos:');
    products.forEach((item) => {
      const totalPrice = (item.price - item.discount) * item.quantity;
      doc.fontSize(12).text(`${item.Product.name}: $${item.price} - $${item.discount} x ${item.quantity} = $${totalPrice}`);
    });
    doc.moveDown();
    doc.fontSize(12).text(`Total: $${total}`);
  
    doc.end();

    const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        // Aquí es donde puedes enviar el correo electrónico con el archivo adjunto
            transporter.sendMail({
                from: `"I sekai" <eliasdaniperez@gmail.com>`, // sender address
                to: `${order.User.email}`, // list of receivers
                subject: `Compra realizada N°${order.id}`, // Subject line
                text: `${customerName} ¡Gracias por su compra! Adjuntamos su factura!`, // plain text body
                attachments: [
                    {
                    filename: filename,
                    content: pdfData,
                    contentType: 'application/pdf'
                    }
                ]
            });
        });
    // Aquí es donde puedes enviar el correo electrónico con el archivo adjunto
  
    // Guardar la ruta del archivo PDF en la base de datos
    invoice.pdfPath = filename;
    await invoice.save();

};

export {
    getTicket
}