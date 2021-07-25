const User = require("../models/Users");
const asyncHandle = require("../middleware/asyncHandle");
const { msgEnum } = require("../enum/message.enum");
const { codeEnum } = require("../enum/statusCode.enum");
const ErrorResponse = require("../common/errorResponse");

module.exports = {
    signUp: asyncHandle(async (req, res, next) => {
        const {
            name,
            email,
            password,
            passwordConfirm
        } = req.body;
        const user = await User.create({
            name,
            email,
            password,
            passwordConfirm
        });
        const token = user.signToken();
        res.status(codeEnum.CREATED).json({
            msg: msgEnum.ADD_SUCCESS,
            token,
        });
    }),
    login: asyncHandle(async (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorResponse(msgEnum.LOGIN_FAIL, codeEnum.BAD_REQUEST));
        }
        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await user.matchPassword(password, user.password))) {
            return next(new ErrorResponse(msgEnum.ACCOUNT_NOT_FOUND, codeEnum.UNAUTHORIZED));
        }
        const token = user.signToken();
        const refreshToken = user.signRefreshToken();
        res.status(codeEnum.SUCCESS).json({
            msg: msgEnum.LOGIN_SUCCESS,
            token,
            refreshToken
        })
    }),
    getToken: asyncHandle(async (req, res, next) => {
        const token = req.user.signToken();
        res.status(codeEnum.SUCCESS).json({ token });
    }),
}