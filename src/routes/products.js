import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { authRoles } from '../middlewares/authRoles.js';
import passport from 'passport';

const router = express.Router();

// Solo usuarios autenticados acceden
router.use(passport.authenticate('jwt', { session: false }));

router.get('/', getProducts);
router.get('/:id', getProductById);

// Solo admin crea, edita y elimina
router.post('/', authRoles('admin'), createProduct);
router.put('/:id', authRoles('admin'), updateProduct);
router.delete('/:id', authRoles('admin'), deleteProduct);

export default router;
