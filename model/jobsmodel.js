// const mongoose = require('mongoose');
// const jobschema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     location: {
//         type: String,
//         required: true
//     },
//     salary: {
//         type: String,
//         required: true
//     },
//     companyid: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'companie',
//     }
// });
// module.exports = mongoose.model('job', jobschema);
const mongoose = require('mongoose');

const jobschema = new mongoose.Schema({

    title: {
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

    jobtype: {
        type: String,
        enum: ['Full Time', 'Part Time', 'Internship', 'Contract'],
        required: true
    },

    experience: {
        type: String, // example: 1-3 years
        required: true
    },

    skills: [
        {
            type: String
        }
    ],

    education: {
        type: String
    },

    vacancies: {
        type: Number,
        default: 1
    },

    deadline: {
        type: Date
    },

    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    },

    companyid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'companie'
    },

    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('job', jobschema);