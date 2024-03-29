import {
  sendRecoveryEmail,
  sendInactiveUserDeletion,
} from "../config/nodemailer.js";
import crypto from "crypto";
import userModel from "../models/users.models.js";
import cartModel from "../models/carts.models.js";
import logger from "../utils/logger.js";
import { createHash, validatePassword } from "../utils/bcrypt.js";

const recoveryLinks = {};

const passwordRecovery = async (req, res) => {
  const { email } = req.body;

  try {
    // Verificación de usuario existente
    const user = await userModel.findOne({ email });
    if (!user) {
      logger.error(`Usuario no encontrado: ${email}`);
      return res.status(400).send({ error: `Usuario no encontrado: ${email}` });
    }
    const token = crypto.randomBytes(20).toString("hex"); // Token único con el fin de no utilizar jwt, para simplificar en este caso.
    recoveryLinks[token] = { email, timestamp: Date.now() };
    const recoveryLink = `http://localhost:4000/api/users/reset-password/${token}`;
    sendRecoveryEmail(email, recoveryLink);
    res.status(200).send({
      resultado: "OK",
      message: "Correo de recuperación enviado correctamente",
    });
  } catch (error) {
    logger.error(`Error al enviar email de recuperacion: ${error}`);
    res
      .status(500)
      .send({ error: `Error al enviar email de recuperacion: ${error}` });
  }
};

const passwordReset = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    // Recupero el token y valido que exista
    const linkData = recoveryLinks[token];
    if (!linkData) {
      logger.error(`Token no encontrado: ${token}`);
      return res.status(400).send({ error: `Token no encontrado: ${token}` });
    }

    // Si existe verifico que no esté expirado
    const now = Date.now();
    const tokenTimestamp = linkData.timestamp;
    const tokenAge = now - tokenTimestamp;
    if (tokenAge > 3600000) {
      logger.error(`Token expirado: ${token}`);
      return res.status(400).send({ error: `Token expirado: ${token}` });
    }

    // Busco al usuario por el mail
    const { email } = linkData;
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        logger.error(`Usuario no encontrado: ${email}`);
        return res
          .status(400)
          .send({ error: `Usuario no encontrado: ${email}` });
      }
      // Verifico que la nueva contraseña no sea vacía
      if (!newPassword) {
        logger.error("La nueva contraseña no puede estar vacía");
        return res
          .status(400)
          .send({ error: "La nueva contraseña no puede estar vacía" });
      }

      // Verifico que la nueva password no sea igual a la anterior
      const isSamePassword = validatePassword(newPassword, user.password);
      if (isSamePassword) {
        logger.error("La nueva password debe ser distinta a la anterior");
        return res.status(400).send({
          error: `La nueva password debe ser distinta a la anterior`,
        });
      }

      // Actualizo el usuario con su nueva password
      user.password = createHash(newPassword);
      await user.save();

      // Elimino el token, ya que se realizó la actualización de la password
      delete recoveryLinks[token];
      logger.info(`Password actualizado correctamente del usuario:  ${email}`);
      return res.status(200).send({
        resultado: "OK",
        message: "Password actualizado correctamente",
      });
    } catch (error) {
      logger.error(`Error al actualizar la password: ${error}`);
      return res
        .status(500)
        .send({ error: `Error al actualizar la password: ${error}` });
    }
  } catch (error) {
    logger.error(`Error al actualizar la password: ${error}`);
    return res
      .status(500)
      .send({ error: `Error al actualizar la password: ${error}` });
  }
};

const uploadDocuments = async (req, res) => {
  try {
    const userId = req.params.uid;
    const newDocuments = req.files.map((file) => ({
      name: file.originalname,
      reference: file.path,
    }));

    const user = await userModel.findById(userId);
    user.documents.push(...newDocuments);
    await user.save();
    res.status(200).send({
      resultado: "OK",
      message: "Documento subido exitosamente",
    });
  } catch (error) {
    logger.error(`Error al subir archivo: ${error}`);
    return res
      .status(500)
      .send({ error: `Archivo subido exitosamente: ${error}` });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    logger.info("Get de todos los usuarios");
    return res.status(200).send({
      resultado: "OK",
      message: users,
    });
  } catch (error) {
    logger.error(`Error al obtener usuarios: ${error}`);
    return res
      .status(500)
      .send({ error: `Error al obtener usuarios: ${error}` });
  }
};

const deleteInactiveUsers = async (req, res) => {
  try {
    const deleteDate = new Date();
    deleteDate.setDate(
      deleteDate.getDate() - process.env.DELETE_INACT_USERS_DAYS
    );
    const usersToDelete = await userModel.find({
      last_connection: { $lt: deleteDate },
    });

    if (usersToDelete.length === 0) {
      logger.info("No se encontraron usuarios inactivos a eliminar");
      return res
        .status(400)
        .send({ error: "No se encontraron usuarios inactivos a eliminar" });
    }

    for (const user of usersToDelete) {
      try {
        await deleteUser(user);
      } catch (error) {
        logger.error(`Error al eliminar usuarios por inactividad : ${error}`);
        return res.status(500).send({
          error: `Error al eliminar usuarios por inactividad : ${error}`,
        });
        return; // Detiene la iteración en caso de error
      }
    }

    logger.info(`Se han eliminado ${usersToDelete.length} por inactividad`);
    return res.status(200).send({
      resultado: "OK",
      message: "Usuarios eliminados por inactividad correctamente",
    });
  } catch (error) {
    logger.error(`Error al eliminar usuarios por inactividad : ${error}`);
    return res
      .status(500)
      .send({ error: `Error al eliminar usuarios por inactividad : ${error}` });
  }
};

const deleteUser = async (user) => {
  const { _id, email, cart } = user;
  try {
    await sendInactiveUserDeletion(email);
    await userModel.findByIdAndDelete(_id);
    await cartModel.findByIdAndDelete(cart);
    logger.info(`Usuario ${_id} eliminado por inactividad`);
  } catch (error) {
    logger.error(`Error al eliminar usuarios por inactividad : ${error}`);
    return res
      .status(500)
      .send({ error: `Error al eliminar usuarios por inactividad : ${error}` });
  }
};

const usersController = {
  passwordRecovery,
  passwordReset,
  uploadDocuments,
  getAllUsers,
  deleteInactiveUsers,
};

export default usersController;
