
import express from 'express';
import passport from 'passport';
import { authRoles } from '../middlewares/authRoles.js';
import {
  createOrGetMyCart,
  getCartById,
  addProductToMyCart,
  updateQuantityInMyCart,
  removeProductFromMyCart,
  emptyMyCart
} from '../controllers/cartController.js';

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

// Crear u obtener mi carrito (solo usuario logueado)
router.post('/', auth, authRoles('user'), createOrGetMyCart);

// Ver carrito por id 
router.get('/:cid', auth, getCartById);

// Agregar producto a MI carrito (user)
router.post('/products/:pid', auth, authRoles('user'), addProductToMyCart);

// Actualizar cantidad de un producto en MI carrito ( user)
router.put('/products/:pid', auth, authRoles('user'), updateQuantityInMyCart);

// Borrar producto de MI carrito (l user)
router.delete('/products/:pid', auth, authRoles('user'), removeProductFromMyCart);

// Vaciar MI carrito ( user)
router.delete('/', auth, authRoles('user'), emptyMyCart);

export default router;
