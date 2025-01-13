import express from 'express';
import cors from 'cors';
import emailRoutes from './routes/emailRoutes';
import organizationRoutes from './routes/organizationRoutes'; // Import the organization routes
import authRoutes from './routes/authRoutes'; // Import the auth routes
import fetchUserRoutes from './routes/fetchuserRoutes';
import articlesRoutes from './routes/articlesRoutes'
import fetcharticlesRoutes from './routes/fetcharticleRoutes'
const app = express();

// Enable CORS
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://botstreet2025.onrender.com'], // Add both development and production URLs
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Middleware to parse JSON
app.use(express.json());

// Use routes
app.use('/api/articles' ,articlesRoutes);
app.use('/api/articlesfetch',fetcharticlesRoutes);


// app.use('/api/email', emailRoutes); // Email-related routes
// app.use('/api/organization', organizationRoutes); // Organization-related routes
// app.use('/api/auth', authRoutes); // Authentication routes (register, login)
// app.use('/api/fetch' ,fetchUserRoutes);
export default app;
