require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const analyzeRoute = require('./routes/analyze'); // 👈 Import your route
const historyRoute = require('./routes/history');
const scaffoldRoute = require('./routes/scaffold');
const generateRoute = require('./routes/generate');
const explainRoute = require('./routes/explain');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/history', historyRoute);
app.use('/scaffold', scaffoldRoute);
app.use('/generate', generateRoute);
app.use('/explain', explainRoute);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Use the analyze route
app.use('/analyze', analyzeRoute); // Requests to /analyze go to routes/analyze.js

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
