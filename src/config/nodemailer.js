import nodemailer from "nodemailer";
import "dotenv/config";
import logger from "../utils/logger.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_RECOVER,
    pass: process.env.PASSWORD_EMAIL_RECOVER,
    authMethod: "LOGIN",
  },
});

// Funciones de nodemailer
export const sendRecoveryEmail = (email, recoveryLink) => {
  const mailOptions = {
    from: process.env.EMAIL_RECOVER,
    to: email,
    subject: "Link de recuperación de su contraseña",
    text: `Por favor haz click en el siguiente enlace ${recoveryLink}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) logger.error(error);
    else logger.info("Email de recuperación enviado correctamente");
  });
};
