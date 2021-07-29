const tourRouter = require("./tour.router");
const authRouter = require("./auth.router");
const userRouter = require("./user.router");
const routers = [tourRouter, authRouter, userRouter];
const errorHandle = require("../middleware/errorHandle");
module.exports = (app) => {
    routers.forEach((router) => {
        app.use("/api", router);
        app.use(errorHandle);
    });
}