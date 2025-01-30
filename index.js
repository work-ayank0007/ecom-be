const express = require('express');
const cors = require('cors'); // Import the CORS package
const cookieParser = require('cookie-parser');
const { dbconnect } = require('./services/database.js');
const router = require('./routes/cart');

const app = express();
const PORT = 3000;

// Allow all origins
app.use(cors());  // This will allow all origins

app.use(cookieParser());
app.use(express.json());

app.use(router);

// Connect to the database
dbconnect();

// Start the server
app.listen(PORT, () => {
    console.log(`App is running on PORT: ${PORT}`);
});
