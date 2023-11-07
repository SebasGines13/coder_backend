import EErrors from "../../services/errors/Enum.js";

export default (error, req, res, next) => {
  console.log(error.message);
  switch (error.code) {
    case EErrors.MISSING_REQUIRED_FIELDS:
      res.status(400).send({ status: "error", error: error.name });
      break;
    default:
      res.status(500).send({ status: "error", error: "Unhandled error" });
  }
};
