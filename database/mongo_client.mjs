// require('dotenv').config();
import mongoose from 'mongoose';

var connection = null;

// Connection URL
// const url = process.env.MONGO_URL;

async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URL);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

async function disconnect() {
  try {
    mongoose.disconnect();
  }
  catch (err) {
    console.log(err);
  }
}

// Export the connect and getDatabase functions
export default {
  connect,
  disconnect
};
