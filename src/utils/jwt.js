import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET || 'secreto-jwt-por-defecto';
const EXPIRATION = '1h'; 


export const generateToken = (payload, expiresIn = EXPIRATION) => {
  return jwt.sign(payload, SECRET, { expiresIn });
};


export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null; 
  }
};
