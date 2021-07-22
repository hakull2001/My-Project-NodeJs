const tourRouter = require("./tour.router");
const routers = [tourRouter];
module.exports = (app) => {
    routers.forEach((router) => {
        app.use("/api", router);
    });
}