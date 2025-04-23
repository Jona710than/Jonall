const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  open_id: { type: String, required: true, unique: true },
  display_name: String,
  avatar_url: String,
  access_token: String,
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);