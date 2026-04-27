const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log('Attempting connection...');

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
  .then(() => {
    console.log('SUCCESS');
    process.exit(0);
  })
  .catch((err) => {
    console.error('ERROR');
    // Log the reason for each server to see why they are considered "unknown" or "unreachable"
    if (err.reason && err.reason.servers) {
        for (const [address, description] of err.reason.servers) {
            console.log(`Server: ${address}`);
            console.log(`Error: ${description.error}`);
            console.log(`Type: ${description.type}`);
        }
    } else {
        console.log(err);
    }
    process.exit(1);
  });
