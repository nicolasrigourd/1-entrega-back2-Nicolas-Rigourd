import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from './config/passport.js';

// rutas
import userRoutes from './routes/users.js';
import sessionRoutes from './routes/sessions.js';
import productRoutes from './routes/products.js'; 
import cartRoutes from './routes/carts.js';
dotenv.config();

const app = express();


app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


app.use(passport.initialize());

// Rutas principales
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/products', productRoutes); 
app.use('/api/carts', cartRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Conectado a MongoDB');
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${process.env.PORT}`);
  });
})
.catch((err) => {
  console.error(' Error conectando MongoDB:', err);
});
