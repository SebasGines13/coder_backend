import passport from "passport";

export const passportError = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error) {
        return next(error);
      }

      if (!user) {
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      }

      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorization = (rols) => {
  return async (req, res, next) => {
    // Se vuelve a consultar si el usuario existe dado que el token puede expirar, el usuario puede borrar el historial.
    if (!req.user) {
      return res.status(401).send({ error: "User no autorizado" });
    }

    const isAuthorized = rols.find((rol) => rol == req.user.user.rol);
    if (!isAuthorized) {
      return res
        .status(403)
        .send({ error: "User no tiene los privilegios necesarios" });
    }

    next();
  };
};
