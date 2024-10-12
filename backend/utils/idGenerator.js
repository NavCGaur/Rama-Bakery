
const IdCounter = require('../models/IdCounter');

async function getNextProductId() {
    const counter = await IdCounter.findOneAndUpdate(
      { name: 'productId' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    console.log('getNextProductId',getNextProductId)

    return counter.value;
  }
  module.exports = {getNextProductId};