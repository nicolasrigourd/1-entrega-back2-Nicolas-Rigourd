import express from 'express';
import { loginUser, forgotPassword, resetPassword } from '../controllers/authController.js';
import { registerUser } from '../controllers/userController.js';
import passport from 'passport';
import { sendEmail } from '../utils/mailer.js'; // ✅ Importamos el mailer

const router = express.Router();

// 🔐 Login y Registro
router.post('/login', loginUser);
router.post('/register', registerUser);

// 👤 Obtener usuario autenticado
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

// 🔄 Recuperación de contraseña
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// 📧 Ruta temporal de prueba para enviar email
router.post('/send-test-email', async (req, res) => {
  try {
    await sendEmail({
      to: 'tucorreo@gmail.com', // Reemplazá con un destinatario real
      subject: '📧 Prueba desde el backend',
      html: '<h1>¡Funciona el envío de correos!</h1><p>Este es un email de prueba enviado con Nodemailer y Gmail.</p>',
    });

    res.json({ message: 'Correo enviado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar el correo', details: error.message });
  }
});

export default router;
