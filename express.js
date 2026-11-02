//creating a simple student feedback management Api system using express.js
const express = require('express');
const mongoose = require('mongoose');
const connc = require('./mongo');
const Feedback = require('./studentModel/feedback');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
	res.send('Express server is running');
});

app.listen(3000, () => {
	console.log(`Server running on 3000`);
});