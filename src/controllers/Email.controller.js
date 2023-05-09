import dotenv from 'dotenv'
import { transporter } from '../services/mailer.js';
dotenv.config()

const emailContact =async (req,res,next) => {
    const { name, email, title, content } = req.body;
    console.log(name,email,title,content);

    // Configurar SendGrid

  
    try {
        let info = await transporter.sendMail({
            from: `"${name}" <${email}>`, // sender address
            to: process.env.EMAIL_NODEMAILER, // list of receivers
            subject: `${title}`, // Subject line
            text: `"${name}" <${email}> envia el siguiente mensaje: ${content}`, // plain text body
          });
    // Enviar una respuesta al cliente
            return res.status(200).json('¡Gracias por contactarnos!');
    } catch (error) {
        console.log(error);
    }
}

export {
    emailContact
}