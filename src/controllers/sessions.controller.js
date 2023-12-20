import { generateToken } from "../utils/jwt.js";
import logger from "../utils/logger.js";

const postSession = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send({ mensaje: `Password invalido` });
    }
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
    };
    const token = generateToken(req.user);
    res.cookie("jwtCookie", token, {
      maxAge: 43200000,
    });
    req.user.last_connection = Date.now();
    await req.user.save();
    res.status(200).send({ payload: req.user });
  } catch (err) {
    logger.error(`Error al iniciar sesion ${err}`);
    res.status(500).send({ mensaje: `Error al iniciar sesion ${err}` });
  }
};

const getCurrentSession = async (req, res) => {
  res.status(200).send({ mensaje: req.user });
};

const getGithubCreateUser = async (req, res) => {
  res.status(200).send({ mensaje: "Usuario creado" });
};

const getGithubSession = async (req, res) => {
  req.session.user = req.user;
  res.status(200).send({ mensaje: "Session creada" });
};

const getLogout = (req, res) => {
  req.session.destroy(async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (req.user) {
      req.user.last_connection = Date.now();
      await req.user.save();
    }
    res.clearCookie("jwtCookie");
    res.status(200).json({ message: "Sesión cerrada con éxito" });
  });
};

const sessionController = {
  postSession,
  getCurrentSession,
  getGithubCreateUser,
  getGithubSession,
  getLogout,
};

export default sessionController;
