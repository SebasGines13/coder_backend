import messageModel from "../models/messages.models.js";
import logger from "../utils/logger.js";

const getMessages = async (req, res) => {
  try {
    const messages = await messageModel.find();
    res.status(200).send({ resultado: "OK", message: messages });
  } catch (error) {
    logger.error(`Error al consultar mensajes: ${error}`);
    res.status(400).send({ error: `Error al consultar mensajes: ${error}` });
  }
};

const postMessage = async (req, res) => {
  const { email, message } = req.body;

  try {
    const respuesta = await messageModel.create({
      email,
      message,
    });
    res.status(200).send({ resultado: "OK", message: respuesta });
  } catch (error) {
    logger.error(`Error al crear mensajes: ${error}`);
    res.status(400).send({ error: `Error al crear mensajes: ${error}` });
  }
};

const messagesController = {
  postMessage,
  getMessages,
};

export default messagesController;
