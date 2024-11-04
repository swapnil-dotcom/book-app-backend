const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const port = process.env.PORT || 5000;

// Middleware
app.use((req, res, next) => {
    if (req.url === '/favicon.ico' || req.url === '/favicon.png') {
        res.status(204).end();
    } else {
        next();
    }
});
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'https://book-app-frontend-kohl.vercel.app'],
    credentials: true,
}));

// Route Imports
const bookRoutes = require('./src/books/book.route');
const orderRoutes = require('./src/orders/order.route');
const userRoutes = require('./src/users/user.route');
const adminRoutes = require('./src/stats/admin.stats');

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Book Store Server is running!');
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: '404 Not Found', message: 'The requested resource does not exist.' });
});

// Start Server After DB Connection
async function main() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Mongodb connected successfully!');

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

main();

