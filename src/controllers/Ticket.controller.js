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


//https://github.com/thecodingstudio/nodejs-ejs-Ecommerce-website/blob/main/controllers/shop.js
const getTicket = async (req, res ) => {
    const { idOrder } = req.params;

    const order = await Order.findOne({where: {id: idOrder}, include: [{model: OrderDetails, include: [Product]}, User]})

    if(order.TicketId) {
        //const ticket = await Ticket.findOne({where: {id:order.TicketId}})
        //const filePath = path.join(__dirname, '..', 'uploads', ticket.status);

        //res.setHeader('Content-Type', 'application/pdf');
        //res.setHeader('Content-Disposition', `attachment; filename=${ticket.status}`);
        //console.log(ticket.status);
        //console.log(filePath);
        return res.status(400).json("Ya se ha enviado la factura");
    }
    // Calcular el total de la factura con descuentos en los productos
    const total = order.totalSale
    const customerName = order.User.name + " " + order.User.lastName
    const dateTime = new Date()
    const tax = order.tax
    const status = "Generando"

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

     const businessAddress = 'Sáenz Peña, Chaco';
     const businessName = 'I Sekai';
     const businessPhone = '555-1234';
     const businessEmail = 'info@minegocio.com';
     const businessLogo = path.join(__dirname,'..','..', 'views' , 'logo.png');
     
     order.TicketId= invoice.id

     order.save()
    // Generar el archivo PDF de la factura
    const doc = new PDFDocument();
    const filename = `invoice-${invoice.id}.pdf`;
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    doc.pipe(fs.createWriteStream(filePath));

	doc.image(businessLogo, 50, 45, { width: 50 })
		.fillColor('#444444')
		.fontSize(20)
		.text('I Sekai', 110, 57)
		.fontSize(10)
		.text('San martin 124', 200, 65, { align: 'right' })
		.text('General Pinedo, Chaco, Argentina', 200, 80, { align: 'right' })
		.moveDown();


// Agrega el título de la factura
doc.moveDown().font('Helvetica-Bold').fontSize(24).text('Factura', { align: 'center' });

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
    invoice.status = filename;
    await invoice.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${invoice.status}.pdf`);
    console.log(filePath);
    return res.download(filePath);

};

export {
    getTicket
}