const multer = require("multer");
const ErrorResponse = require("./errorResponse");
const { codeEnum } = require("../enum/statusCode.enum");
const { msgEnum } = require("../enum/message.enum");
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/image/user");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    } else {
        cb(new ErrorResponse(msgEnum.WRONG_FILE_TYPE, codeEnum.BAD_REQUEST), false);
    }
}
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single("photo");