const mongoose = require('mongoose');

const jobsSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide company']
    },
    position: {
        type: String,
        required: [true, 'Please provide position']
    },
    status: {
        type: String,
        enum: ['pending', 'interview', 'rejected'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Jobs', jobsSchema);