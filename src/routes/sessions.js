import express from 'express';
 import { loginUser } from '../controllers/authController.js';
import passport from 'passport';

const router = express.Router();


router.post('/login', loginUser);

// Ruta-- devuelve ususario logueado

router.get(
         '/current',
  passport.authenticate('jwt', { session: false }),
          (req, res) => {
    const { first_name, last_name, email, role, age } = req.user;

    res.json({
      user: {
        first_name,
        last_name,
        email,
         age,
        role
      }
    });
  }
);

        export default router;
