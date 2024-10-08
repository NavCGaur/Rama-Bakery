const mongoose = require('mongoose');

const idCounterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 0 }
});

const IdCounter = mongoose.model('IdCounter', idCounterSchema);

module.exports = IdCounter;
