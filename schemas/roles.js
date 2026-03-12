let mongoose = require('mongoose');

let roleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ""
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('role', roleSchema)
