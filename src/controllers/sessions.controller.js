import { generateToken } from "../utils/jwt.js";

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
    console.log(token);
    res.status(200).send({ payload: req.user });
  } catch (err) {
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
  if (req.session) {
    req.session.destroy();
  }
  res.clearCookie("jwtCookie");
  res.status(200).send({ resultado: "Login eliminado" });
};

const sessionController = {
  postSession,
  getCurrentSession,
  getGithubCreateUser,
  getGithubSession,
  getLogout,
};

export default sessionController;
