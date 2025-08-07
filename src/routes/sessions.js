import express from 'express';
import { loginUser, forgotPassword, resetPassword } from '../controllers/authController.js';
import { registerUser } from '../controllers/userController.js';
import passport from 'passport';
import { sendEmail } from '../utils/mailer.js';

const router = express.Router();


router.post('/login', loginUser);
router.post('/register', registerUser);


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
        role,
      },
    });
  }
);


router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.post('/send-test-email', async (req, res) => {
  try {
    await sendEmail({
      to: 'tucorreo@gmail.com', 
      subject: ' Prueba desde el backend',
      html: '<h1>¡Funciona el envío de correos!</h1><p>Este es un email de prueba enviado con Nodemailer y Gmail.</p>',
    });

    res.json({ message: 'Correo enviado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar el correo', details: error.message });
  }
});

export default router;
