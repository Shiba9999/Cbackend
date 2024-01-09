//for company website
const express = require('express');
var cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());//to handle cors error 
app.use(express.json());//This middleware parses JSON in the request body
const port = process.env.PORT || 3000;

app.post('/contact', (req, res) => {
    const { email, subject, message } = req.body;
    console.log('Received data:', { email, subject, message });
    res.status(200).json({ success: true, message: 'Data received successfully' });
});


app.listen(port, () => {
  console.log(`server is running ${port}` );
});
