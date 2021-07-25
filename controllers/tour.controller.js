const Tours = require("../models/Tours");
const asyncHandle = require("../middleware/asyncHandle");
const { msgEnum } = require("../enum/message.enum");
const { codeEnum } = require("../enum/statusCode.enum");
const ErrorResponse = require("../common/errorResponse");
module.exports = {
    getTour: asyncHandle(async (req, res, next) => {
        const tour = await Tours.findById(req.params.id);
        if (!tour) {
            return next(new ErrorResponse(msgEnum.TOUR_NOT_FOUND, codeEnum.NOT_FOUND));
        }
        res.status(codeEnum.SUCCESS).json(tour);
    }),
    getAllTours: asyncHandle(async (req, res, next) => {
        const tour = await Tours.find({});
        res.status(codeEnum.SUCCESS).json({
            msg: "success",
            data: {
                tour
            },
        });
    }),
    createTour: asyncHandle(async (req, res, next) => {
        const {
            name,
            rating,
            price,
            durations,
            maxGroupSize,
            difficulty,
            description,
            imageCover
        } = req.body;
        const tour = await Tours.create({
            name,
            rating,
            price,
            durations,
            maxGroupSize,
            difficulty,
            description,
            imageCover
        });
        res.status(codeEnum.CREATED).json({
            msg: msgEnum.ADD_SUCCESS,
            data: tour
        });
    }),
    updateTour: asyncHandle(async (req, res, next) => {
        const tour = await Tours.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!tour) {
            return next(new ErrorResponse(msgEnum.TOUR_NOT_FOUND, codeEnum.NOT_FOUND));
        }
        res.status(codeEnum.SUCCESS).json({
            msg : msgEnum.UPDATE_SUCCESS
        })
    }),
    deleteTour: asyncHandle(async(req, res, next) => {
        const tour = await Tours.findByIdAndDelete(req.params.id);
        if (!tour) {
            return next(new ErrorResponse(msgEnum.TOUR_NOT_FOUND, codeEnum.NOT_FOUND));
        }
        res.status(codeEnum.SUCCESS).json({
            msg: msgEnum.DELETE_SUCCESS
        });
    }),
}