const User = require("../models/Users");
const ErrorResponse = require("../common/errorResponse");
const asyncHandle = require("../middleware/asyncHandle");
const { codeEnum } = require("../enum/statusCode.enum");
const { msgEnum } = require("../enum/message.enum");

module.exports = {
    getAllUsers: asyncHandle(async (req, res, next) => {
        const users = await User.find();
        res.status(codeEnum.SUCCESS).json({
            data: users
        });
    })
}