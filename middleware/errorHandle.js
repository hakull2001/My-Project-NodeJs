const errorResponse = require("../common/errorResponse");
const { mongoEnum } = require("../enum/mongo.enum");
const { msgEnum } = require("../enum/message.enum");
const { codeEnum } = require("../enum/statusCode.enum");
const { mongo } = require("mongoose");
const handleJWTExpiresError = () => {
  return new errorResponse(msgEnum.TOKEN_HAS_EXPIRED, codeEnum.UNAUTHORIZED);
};
const handleJWTError = () => {
  return new errorResponse(msgEnum.TOKEN_INVALID, codeEnum.UNAUTHORIZED);
};
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new errorResponse(message, 400);
};

const handleDuplicateError = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new errorResponse(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new errorResponse(message, 400);
};

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(err);

    res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") sendDevError(err, res);
  if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (error.name === mongoEnum.CAST) error = handleCastError(error);
    if (error.code === mongoEnum.DUPLICATE) error = handleDuplicateError(error);
    if (error.name === mongoEnum.VALIDATION) error = handleValidationError(error);
    if (error.name === mongoEnum.JSON_WEB_TOKEN_ERROR) error = handleJWTError();
    if (error.name === mongoEnum.TOKEN_EXPIRES_ERROR) error = handleJWTExpiresError();

    sendProdError(error);
  }
};