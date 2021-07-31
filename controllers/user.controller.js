const User = require("../models/Users");
const factory = require("./handleFactory");
module.exports = {
    getAllUsers: factory.getAllDocument(User),
    getUser: factory.getDocument(User),
    createUser: factory.createDocument(User),
    updateUser: factory.updateDocument(User),
    deleteUser : factory.deleteDocument(User)
}