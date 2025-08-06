import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from './config/passport.js';

// Importación de rutas
import userRoutes from './routes/users.js';
import sessionRoutes from './routes/sessions.js';

dotenv.config();

const app = express();

// Middleware para aceptar JSON y cookies
app.use(express.json());
app.use(cookieParser());

// Configuración de CORS (frontend corriendo en Vite, por defecto puerto 5173)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Inicializar Passport
app.use(passport.initialize());

// Rutas principales
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);

// Conexión a MongoDB y arranque del servidor
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
  console.error('❌ Error conectando MongoDB:', err);
});
