const mongoose = require("mongoose");
const companieSchema = new mongoose.Schema({
    companiename: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    companydescription: {
        type: String
    },
    companyaddress: {
        type: String
    }
});

module.exports = mongoose.model('companie', companieSchema);