const { findByIdAndDelete } = require("../models/Tours");
const Tours = require("../models/Tours");

module.exports = {
    getTour: async (req, res, next) => {
        const tour = await Tours.findById(req.params.id);
        if (!tour) {
            return new Error("Chuyến đi không tồn tại");
        }
        res.status(200).json({
            status: "success",
            data : tour
        })
    },
    getAllTours: async (req, res, next) => {
        const tour = await Tours.find({});
        res.status(200).json({
            status: "success",
            data: {
                tour
            },
        });
    },
    createTour: async (req, res, next) => {
        const { name, rating, price } = req.body;
        const tour = await Tours.create({
            name, rating, price
        });
        res.status(201).json({
            status: "success",
            data: tour
        });
    },
    updateTour: async (req, res, next) => {
        const tour = await Tours.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!tour) {
            return new Error("Không tìm thấy chuyến đi")
        }
        res.status(200).json({
            status : "Cập nhật chuyến đi thành công"
        })
    },
    deleteTour: async (req, res, next) => {
        const tour = await Tours.findByIdAndDelete(req.params.id);
        if (!tour) {
            return new Error(`Không tìm thấy chuyến đi có Id ${id}`);
        }
        res.status(200).json({
            status: "Xóa thành công"
        });
    }
}