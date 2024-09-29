const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
 username: {
    type: String,
    required: true,
    trim: true
  },

  password: {
    type: String,
    required: true,
  },
 
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
