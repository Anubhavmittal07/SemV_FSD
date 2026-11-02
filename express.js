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

app.post('/api/feedback', async (req, res) => {
	const feedback = await Feedback.create({
		studentName: req.body.studentName,
		courseName: req.body.courseName,
		message: req.body.message,
		rating: req.body.rating,
	});

	res.status(201).json({
		message: 'Feedback submitted successfully',
		feedback,
	});
});

app.get('/api/feedback', async (req, res) => {
	const page = Number(req.query.page || 1);
	const limit = Number(req.query.limit || 10);

	if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1) {
		return res.status(400).json({ message: 'page and limit must be valid' });
	}

	const [feedback, total] = await Promise.all([
		Feedback.find()
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit),
		Feedback.countDocuments(),
	]);

	res.json({ feedback, currentPage: page, total});
});

app.patch('/api/feedback/:id', async (req, res) => {
	const { id } = req.params;
	const { status } = req.body;

	if (!mongoose.isValidObjectId(id)) {
		return res.status(400).json({ message: 'Invalid feedback ID' });
	}

	if (!['Pending', 'Reviewed'].includes(status)) {
		return res.status(400).json({ message: 'status must be Pending or Reviewed' });
	}

	const feedback = await Feedback.findByIdAndUpdate(
		id,
		{ status },
		{ new: true, runValidators: true },
	);

	if (!feedback) {
		return res.status(404).json({ message: 'Feedback not found' });
	}

	res.json({ message: 'Feedback status updated successfully', feedback });
});

app.use((error, req, res, next) => {
	if (error instanceof mongoose.Error.ValidationError) {
		return res.status(400).json({ message: error.message });
	}

	console.error(error);
	res.status(500).json({ message: 'Internal server error' });
});

async function startServer() {
	try {
		await connc();
		app.listen(3000, () => {
			console.log(`Server listening on 3000`);
		});
	} catch (error) {
		console.error('Failed to start server:', error);
		process.exitCode = 1;
	}
}

if (require.main === module) {
	startServer();
}

module.exports = app;