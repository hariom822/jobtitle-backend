const mongoose = require('mongoose');
const jobschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    companyid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'companie',
        required: true
    }
});
module.exports = mongoose.model('job', jobschema);