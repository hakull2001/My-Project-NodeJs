const Tour = require("../models/Tours");
const factory = require("./handleFactory");
module.exports = {
    getTour: factory.getDocument(Tour),
    getAllTours: factory.getAllDocument(Tour),
    createTour: factory.createDocument(Tour),
    updateTour: factory.updateDocument(Tour),
    deleteTour: factory.deleteDocument(Tour)
}