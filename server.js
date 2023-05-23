const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

//connect Database
connectDB();

// Init middleware
app.use(express.json());

app.get('/', (req, res)=>{
    res.send("Api running");
})

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require("./routes/api/auth"));
app.use('/api/profile', require("./routes/api/profile"));
app.use('/api/post', require("./routes/api/post"));

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
})