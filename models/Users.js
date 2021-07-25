const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
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
    }
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
module.exports = mongoose.model("users", UserSchema);