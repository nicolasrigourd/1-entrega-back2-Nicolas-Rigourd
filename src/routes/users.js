import express from 'express';
import {
  registerUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

// Registro
router.post('/register', registerUser);


// CRUD 

router.get('/', getAllUsers);            // Listar todos
router.get('/:id', getUserById);      // ver
router.put('/:id', updateUser);        // Editar
router.delete('/:id', deleteUser);    // Eliminar

export default router;
