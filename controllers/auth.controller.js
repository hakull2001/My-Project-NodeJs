const User = require("../models/Users");
const asyncHandle = require("../middleware/asyncHandle");
const { msgEnum } = require("../enum/message.enum");
const { codeEnum } = require("../enum/statusCode.enum");
const ErrorResponse = require("../common/errorResponse");
const crypto = require("crypto");
const sendMail = require("../helpers/sendMail");

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
    restrictTo: (...roles) => {
        return (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                return next(new ErrorResponse(msgEnum.NOT_PERMISSION_DELETE, codeEnum.FORBIDDEN));
            }
            next();
        }
    },
    forgotPassword: asyncHandle(async (req, res, next) => {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return next(new ErrorResponse(msgEnum.EMAIL_INVALID, codeEnum.NOT_FOUND));
        }
        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });
        const resetURL = `${req.protocol}://${req.get(`host`)}api/reset-password/${resetToken}`;
        const message = `Vui lòng click vào đây ${resetURL} để cập nhật lại mật khẩu.
        Link tồn tại trong ${process.env.REFRESH_TOKEN_EXPIRES} phút`;

        const options = {
            email: user.email,
            subject: "Quên mật khẩu",
            message,
        };
        await sendMail(options);
        res.status(codeEnum.SUCCESS).json({
            msg: msgEnum.MAIL_SENT
        });
    }),
    resetPassword: asyncHandle(async (req, res, next) => {
        const hashedToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });
        if (!user) {
            return next(new ErrorResponse(msgEnum.TOKEN_INVALID_OR_EXPIRES, codeEnum.BAD_REQUEST));
        }
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        
        res.status(codeEnum.SUCCESS).json({
            msg: msgEnum.RESET_PASSWORD_SUCCESS
        });
    }),
    updatePassword: asyncHandle(async (req, res, next) => {
        const { newPassword, oldPassword, passwordConfirm } = req.body;
        if (!oldPassword) {
            return next(new ErrorResponse(msgEnum.INVALID_OLD_PASSWORD, codeEnum.BAD_REQUEST));
        }
        if (!newPassword) {
            return next(new ErrorResponse(msgEnum.INVALID_PASSWORD, codeEnum.BAD_REQUEST));
        }
        const user = await User.findById(req.user.id).select("+password");
        if (!(await user.matchPassword(oldPassword, user.password))) {
            return next(new ErrorResponse(msgEnum.CURRENT_PASSWORD_INVALID, codeEnum.UNAUTHORIZED));
        }
        user.password = newPassword;
        user.passwordConfirm = passwordConfirm;
        await user.save();
        const token = user.signToken();
        res.status(codeEnum.SUCCESS).json({
            token,
        });
    }),
    getMe: asyncHandle(async (req, res, next) => {
        const user = await User.findById(req.user.id);
        res.status(codeEnum.SUCCESS).json(user);
    }),
    updateDetails: asyncHandle(async (req, res, next) => {
        console.log(req.file);
        console.log(req.body);
        const allowFields = {
            name: req.body.name,
            photo: req.body.photo,
        }
        if (req.file) allowFields.photo = req.file.filename;
        for (let key in allowFields) {
            if (!allowFields[key]) {
                delete allowFields[key];
            }
        }
        const user = await User.findByIdAndUpdate(req.user.id, allowFields, {
            new: true,
            runValidators: true
        });
        res.status(codeEnum.SUCCESS).json({
            msg: msgEnum.UPDATE_SUCCESS
        });
    }),
    deleteMe: asyncHandle(async (req, res, next) => {
        await User.findByIdAndUpdate(req.user.id, { active: false });
        res.status(codeEnum.SUCCESS).json({
            msg: msgEnum.DELETE_ACCOUNT_SUCCESS
        });
    })
}