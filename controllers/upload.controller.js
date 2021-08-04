const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

module.exports = {
    uploadImages: upload.fields([
        {
            name: "photo", maxCount: 1
        },
        {
            name: "imageCover", maxCount: 1
        }]),
};