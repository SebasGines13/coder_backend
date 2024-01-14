import nodemailer from "nodemailer";
import "dotenv/config";
import logger from "../utils/logger.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_NODEMAILER,
    pass: process.env.PASSWORD_EMAIL_NODEMAILER,
    authMethod: "LOGIN",
  },
});

// Funciones de nodemailer
export const sendRecoveryEmail = (email, recoveryLink) => {
  const mailOptions = {
    from: process.env.EMAIL_NODEMAILER,
    to: email,
    subject: "Link de recuperación de su contraseña",
    text: `Por favor haz click en el siguiente enlace ${recoveryLink}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) logger.error(error);
    else logger.info("Email de recuperación enviado correctamente");
  });
};

export const sendInactiveUserDeletion = (email) => {
  const mailOptions = {
    from: process.env.EMAIL_NODEMAILER,
    to: email,
    subject: "Usuario eliminado por inactividad",
    text: "Usuario eliminado por inactividad",
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) logger.error(error);
    else
      logger.info(
        "Email de eliminación de cuenta por inactividad enviado correctamente"
      );
  });
};

export const sendPurchase = (email, amount, products) => {
  // Tabla HTML con los detalles de los productos
  const productTable = `
    <table border="1">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Precio</th>
          <th>Cantidad</th>
        </tr>
      </thead>
      <tbody>
        ${products
          .map(
            (product) => `
          <tr>
            <td>${product.id_prod.title}</td>
            <td>${product.id_prod.price}</td>
            <td>${product.quantity}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
  const mailOptions = {
    from: process.env.EMAIL_NODEMAILER,
    to: email,
    subject: "Gracias por realizar su compra con nosotros",
    html: `
      <p>El total de su compra es $${amount}</p>
      ${productTable}
    `,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) logger.error(error);
    else logger.info("Email por finalización de compra enviado correctamente");
  });
};
