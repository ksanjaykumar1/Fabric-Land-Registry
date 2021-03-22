const express = require('express');
const { body } = require('express-validator');
const connectDB = require('./config/db');
const app = express();
//look for environment variable
const PORT = process.env.PORT || 5000;


connectDB();

//init middleware
//this is new way of bringing the body parser
app.use(express.json({extended: false}))

app.get('/',(req,res)=> res.send('API running'));

//Define Routes

app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
//app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/fabric', require('./routes/api/fabric'))

app.listen(PORT, ()=> console.log(`server started on port ${PORT} `))