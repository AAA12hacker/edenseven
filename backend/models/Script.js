const mongoose = require('mongoose');

const scriptSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    completed:{ 
        type: Boolean, 
        default: false,
    }, 
    scheduledOn:{
        type: Date,
        default: Date.now,
    },
    completionDate: {
        type: Date,
    },
    usageCount:{
        type: Number,
        default: 0,
    },
    lastUsedAt:{
        type:Date,
        default: Date.now,
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'active', // Add status field to track task status
    }
});

const Script = mongoose.model('Script', scriptSchema);

module.exports = Script;