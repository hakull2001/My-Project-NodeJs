const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const ErrorResponse = require("../common/errorResponse");
const client = require("../config/redis");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Tên người dùng không được để trống"],
    },
    email: {
        type: String,
        required : [true, "Email người dùng là bắt buộc"],
        match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Sai định dạng email",
        ],
        unique: [true, "Email đã tồn tại"],
        lowercase: true,
        validate : [validator.isEmail, "Vui lòng nhập một email hợp lệ !"],
    },
    photo: String,
    password: {
        type: String,
        required: [true, "Vui lòng nhập mật khẩu của bạn !"],
        minLength : 8
    },
    passwordConfirm: {
        type: String,
        required: [true, "Vui lòng xác nhận mật khẩu"],
        validate: {
            validator : function (el) {
            return el === this.password
        },
        message : "Mật khẩu không trùng khớp",
        }
    },
    role: {
        type : String,
        default: 'user',
        enum: ['user', 'guide', 'lead-guide', 'admin']
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt : Date,
});
UserSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
})
UserSchema.methods.signToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
}
UserSchema.methods.matchPassword = async function (
    candidatePassword,
    userPassword
){
    return await bcrypt.compare(candidatePassword, userPassword);
}
UserSchema.methods.signRefreshToken = function () {
    const refreshToken = jwt.sign(
        { id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
    );
    client.set(this._id.toString(), refreshToken, (error,res) => {
        console.log(error);
    });
    return refreshToken;
}
UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changeTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return changeTimestamp < JWTTimestamp;
    }
    return false;
}
UserSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}
UserSchema.pre("save", function (next) {
    if (!this.isModified('password') || this.isNew)
        return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
})
module.exports = mongoose.model("users", UserSchema);