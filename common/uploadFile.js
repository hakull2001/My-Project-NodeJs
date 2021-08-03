const multer = require("multer");
const sharp = require("sharp");
const ErrorResponse = require("./errorResponse");
const { codeEnum } = require("../enum/statusCode.enum");
const { msgEnum } = require("../enum/message.enum");
// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public/image/user");
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split("/")[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// });
const multerStorage = multer.memoryStorage();
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
exports.resizeUserPhoto = (req, res, next) => {
    if (!req.file) return next();
    sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/image/user/${req.file.filename}`);
    next();
}
