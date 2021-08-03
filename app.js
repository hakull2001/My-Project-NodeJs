const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const path = require("path");
const xss = require("xss-clean");
const app = express();
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(express.static(`${__dirname}/public`));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const limiter = rateLimit({
  max: 8,
  windowMs: 60 * 60 * 1000,
  message : "Bạn đã yêu cầu quá nhiều mã, hãy thử lại sau một giờ sau đó."
})
app.use("/api/reset-password", limiter);
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.get("/", (req, res) => {
  res.status(200).render("base");
})
require("./config/database")();
module.exports = app;
