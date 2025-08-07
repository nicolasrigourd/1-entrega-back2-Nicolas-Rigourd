import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER, 
    pass: process.env.MAIL_PASS, 
  },
});

export const sendEmail = async ({ to, subject, html, attachments }) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject,
    html,
    attachments,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Correo enviado con éxito:', result.response);
    return result;
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
};
