const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log('Attempting to connect to:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB');
    process.exit(0);
  })
  .catch((err) => {
    console.error('FAILURE: Connection failed');
    console.error('Error Code:', err.code);
    console.error('Error Name:', err.name);
    console.error('Full Error:', err);
    process.exit(1);
  });
