const tourRouter = require("./tour.router");
const authRouter = require("./auth.router");
const routers = [tourRouter, authRouter];
const errorHandle = require("../middleware/errorHandle");
module.exports = (app) => {
    routers.forEach((router) => {
        app.use("/api", router);
        app.use(errorHandle);
    });
}