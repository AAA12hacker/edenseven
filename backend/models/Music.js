const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Music schema
const musicSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  filePath: {
    type: Schema.Types.ObjectId, // Store GridFS file ID
    required: true,
    ref: 'fs.files' // Reference to the GridFS files collection
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Reference to the User model
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create the Music model
const Music = mongoose.model('Music', musicSchema);

module.exports = Music;
