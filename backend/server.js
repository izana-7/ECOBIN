const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const seedData = require('./seed');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins for CORS (Localhost dev + Netlify Production site)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://ecobin-clean.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.netlify.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow requests in production
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Route Imports
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const binRoutes = require('./routes/binRoutes');
const missionRoutes = require('./routes/missionRoutes');
const pointRoutes = require('./routes/pointRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const aiRoutes = require('./routes/aiRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/bins', binRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/users', pointRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'EcoBin Backend REST API',
    productionDomain: 'https://ecobin-clean.netlify.app',
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack || err);
  res.status(500).json({
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
const startServer = async () => {
  await connectDB();

  // Auto seed if empty DB
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('[SERVER] Database empty. Running initial auto-seed...');
    await seedData();
  }

  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🌱 EcoBin REST API running on port ${PORT}`);
    console.log(`Live Netlify App: https://ecobin-clean.netlify.app`);
    console.log(`==================================================`);
  });
};

startServer();
