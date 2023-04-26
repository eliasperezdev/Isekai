import sendMail from '../services/mailService';

async function sendWelcomeEmail(mail) {

  const data = {
    text: "Bienvenido a I Sekai",
    subject: `Welcome to`,
    ongContact: [
      {
        type: 'Phone',
        value: "3731448148",
      },
      {
        type: 'Email',
        value: "isekaishop08@gmail.com",
      },
    ],
  };
  await sendMail(mail, data, data.subject);
}

export default sendWelcomeEmail;