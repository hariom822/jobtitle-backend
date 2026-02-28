const mongoose = require('mongoose');
const companieschema = new mongoose.Schema({
    name: {
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
    description: {
        type: String
    },
    workstatus: {
        enum: ['fresher', 'experienced'],
        type: String,
        default: 'fresher'
    },
    city:{
        type: String
    },
    address: {
        type: String
    }
});
module.exports = mongoose.model('candidate', companieschema);