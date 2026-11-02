//creating a simple student feedback management Api system using express.js
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
	res.send('Express server is running');
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});