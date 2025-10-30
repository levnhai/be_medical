// Using Node.js `require()`
const mongoose = require('mongoose');

async function Connect() {
  try {
    // await mongoose.connect('mongodb://localhost:27017/medical');
    // await mongoose.connect(
    //   'mongodb+srv://root:Levanhai123@db-medical.5qlch.mongodb.net/db-medical?retryWrites=true&w=majority&appName=db-medical',
    // );
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connect successful');
  } catch (error) {
    console.log('Connect Failure');
  }
}

module.exports = { Connect, mongoose };
