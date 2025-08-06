import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET || 'secreto-jwt-por-defecto';
const EXPIRATION = '1h'; // Puedes ajustar según tus necesidades

// Generar un token JWT (por ejemplo, al hacer login o enviar recuperación)
export const generateToken = (payload, expiresIn = EXPIRATION) => {
  return jwt.sign(payload, SECRET, { expiresIn });
};

// Verificar un token JWT (por ejemplo, al acceder a /current o usar el link de recuperación)
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null; // En controladores verificamos si retorna null = inválido o vencido
  }
};
