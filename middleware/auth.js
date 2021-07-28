const jwt = require("jsonwebtoken");
const { promisify } = require('util');
const redisClient = require("../config/redis");
const User = require("../models/Users");
const { codeEnum } = require("../enum/statusCode.enum");
const { msgEnum } = require("../enum/message.enum");
const asyncHandle = require("../middleware/asyncHandle");
const ErrorResponse = require("../common/errorResponse");
module.exports = {
     protect: asyncHandle(async (req, res, next) => {
        let token;
        if (
         req.headers.authorization &&
         req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
        if (!token) {
             return next(new ErrorResponse(msgEnum.TOKEN_INVALID, codeEnum.UNAUTHORIZED));
        }
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new ErrorResponse(msgEnum.TOKEN_INVALID, codeEnum.UNAUTHORIZED));
        }
        if (user.passwordChangedAfter(decoded.iat)) {
            return next(new ErrorResponse(msgEnum.ACCESS_PROCESS_FAIL, codeEnum.UNAUTHORIZED));
        }
        req.user = user;
        next();
  }),
    veryRefreshToken: asyncHandle(async (req, res, next) => {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return next(new ErrorResponse(msgEnum.TOKEN_INVALID, codeEnum.BAD_REQUEST));
        }
        const decoded = await promisify(jwt.verify)(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const redisToken = await promisify(redisClient.get).bind(redisClient)(`${decoded.id}`);

        if (!redisToken) {
            return next(new ErrorResponse(msgEnum.TOKEN_NOT_FOUND, codeEnum.NOT_FOUND));
        }
        if (redisToken !== refreshToken)
            return next(new ErrorResponse(msgEnum.TOKEN_INVALID, codeEnum.BAD_REQUEST));
        const user = await User.findById(decoded.id);
        if (!user)
            return next(new ErrorResponse(msgEnum.USER_NOT_FOUND, codeEnum.NOT_FOUND));
        req.user = user;
        next();
    })
}