require('dotenv').config();
const mongoose = require('mongoose');


// Connection URL
const url = process.env.MONGO_URL;

async function connect() {
  try {
    return await mongoose.connect(url);
    
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Export the connect and getDatabase functions
module.exports = {
  connect
};
