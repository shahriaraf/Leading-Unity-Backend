const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const proposalRoutes = require('./routes/proposalRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/proposals', proposalRoutes);

// Error middleware
app.use(notFound);
app.use(errorHandler);

// No app.listen()
// Export for Vercel serverless
module.exports = app;
