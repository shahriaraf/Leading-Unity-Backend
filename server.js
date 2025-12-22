const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const proposalRoutes = require('./routes/proposalRoutes');

dotenv.config();
connectDB();

const app = express();

// Allow requests from any origin
app.use(cors({
  origin: '*', // ✅ Allow all origins
  credentials: true, // optional, needed only if sending cookies or auth headers
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/proposals', proposalRoutes);

app.use(notFound);
app.use(errorHandler);

// ✅ UPDATED: Works on Vercel AND Localhost
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

module.exports = app;
