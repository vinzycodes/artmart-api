const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const artsRoutes = require('./routes/arts');

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Request logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to ArtMart API',
        version: '1.0.0',
        endpoints: {
            'GET /api/arts': 'Get all arts',
            'GET /api/arts/:id': 'Get art by ID',
            'POST /api/arts': 'Create new art',
            'PUT /api/arts/:id': 'Update art by ID',
            'DELETE /api/arts/:id': 'Delete art by ID'
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/arts', artsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found', path: req.path });
});

// Start server
app.listen(PORT, () => {
    console.log(`ArtMart API server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;