const express = require('express');
const app = express();
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Importing Routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');
const reviewRoutes = require('./routes/reviewer');

const port = 4000;

dotenv.config();

mongoose.connect(process.env.DB_CONNECT, {
	useNewUrlParser: true
}, () => {
	console.log('Connnected to db');
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//Route Middleware
app.use('/admin', authRoutes);
app.use('/task', taskRoutes);
app.use('/review', reviewRoutes);

app.listen(port, () => {
	console.log(`working on port ${port}`);
}); 