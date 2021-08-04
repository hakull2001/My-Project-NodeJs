const multer = require("multer");
const sharp = require("sharp");
const upload = multer({ dest: "/uploads" });
exports.uploadUserPhoto = upload.single("photo");
// exports.resizeUserPhoto = (req, res, next) => {
//     if (!req.file) return next();
//     sharp(req.file.buffer)
//         .resize(500, 500)
//         .toFormat("jpeg")
//         .jpeg({ quality: 90 })
//         .toFile(`public/image/user/${req.file.filename}`);
//     next();
// }
