// Using Node.js `require()`
const mongoose = require('mongoose');

async function Connect() {
  try {
    await mongoose.connect('mongodb://localhost:27017/medical');
    console.log('Connect successful');
  } catch (error) {
    console.log('Connect Failure');
  }
}

module.exports = { Connect };
