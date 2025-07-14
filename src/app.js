import express from 'express';
import mongoose from 'mongoose';
 import dotenv from 'dotenv';
 import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from './config/passport.js';

 import userRoutes from './routes/users.js';
import sessionRoutes from './routes/sessions.js';

dotenv.config();

const app = express();

// Config recibir front

app.use(cors({
  origin: 'http://localhost:5173',         // Cambiar si usás otro puerto en el frontend
  credentials: true
}));

  app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// rutas

  app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);

// Conexión a MongoDB
    mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(process.env.PORT, () => {
          console.log(` Servidor corriendo en http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => console.error(' Error conectando MongoDB:', err));
