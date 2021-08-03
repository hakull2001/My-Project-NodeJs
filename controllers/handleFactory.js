const asyncHandle = require("../middleware/asyncHandle");
const { codeEnum } = require("../enum/statusCode.enum");
const { msgEnum } = require("../enum/message.enum");
const ErrorResponse = require("../common/errorResponse");
const ApiFeatures = require("../middleware/apiFeatures");
const sendResponse = (document, statusCode, message, res) => {
    res.status(statusCode).json({
        msg: message,
        data : document
    })
}
exports.updateDocument = Model => asyncHandle(async (req, res, next) => {
     const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
        });
    if (!doc) {
        return next(new ErrorResponse(msgEnum.DATA_NOT_FOUND, codeEnum.NOT_FOUND));
        }
    sendResponse(doc, codeEnum.SUCCESS, msgEnum.UPDATE_SUCCESS, res);
})

exports.createDocument = Model => asyncHandle(async (req, res, next) => {
    const doc = await Model.create(req.body);

    sendResponse(doc, codeEnum.CREATED, msgEnum.ADD_SUCCESS, res);
})

exports.deleteDocument = Model => asyncHandle(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new ErrorResponse(msgEnum.DATA_NOT_FOUND, codeEnum.NOT_FOUND));
    }
    sendResponse(null, codeEnum.SUCCESS, msgEnum.DELETE_SUCCESS, res);
})
exports.getDocument = (Model, popOptions) => asyncHandle(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
        return next(new ErrorResponse(msgEnum.DATA_NOT_FOUND, codeEnum.NOT_FOUND));
    }
     res.status(codeEnum.SUCCESS).json({data : doc});
})
exports.getAllDocument = Model => asyncHandle(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new ApiFeatures(Model.find(filter), req.query)
        .fields()
        .filter()
        .sort()
        .paginate();
    const doc = await features.query;
    res.status(codeEnum.SUCCESS).json({ data: doc });
})