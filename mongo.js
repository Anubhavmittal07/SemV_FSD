const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function connc() {
	const link = process.env.MONGODB_URI;

	if (!link) {
		throw new Error('MONGODB_URI is not set');
	}

	await mongoose.connect(link);
	console.log('Connected to Database');
}

module.exports = connc;
