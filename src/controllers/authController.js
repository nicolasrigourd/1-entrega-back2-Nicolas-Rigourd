import { User } from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../utils/mailer.js';

// 🔐 Login de usuario
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({ error: 'Usuario no encontrado' });

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch)
      return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res
      .cookie('jwtToken', token, {
        httpOnly: true,
        secure: false, // true solo en producción con HTTPS
        maxAge: 3600000, // 1 hora
      })
      .json({ message: 'Login exitoso' });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión', details: err.message });
  }
};

// 📩 Solicitud de recuperación de contraseña
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ error: 'Usuario no encontrado' });

    const token = crypto.randomBytes(20).toString('hex');
    const expiration = Date.now() + 3600000; // 1 hora

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiration;
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    await sendEmail({
      to: user.email,
      subject: 'Recuperación de contraseña',
      html: `
        <h3>Recuperación de contraseña</h3>
        <p>Para restablecer tu contraseña, hacé clic en el siguiente enlace:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    });

    res.json({ message: 'Correo enviado con instrucciones' });
  } catch (err) {
    res.status(500).json({ error: 'Error en la recuperación', details: err.message });
  }
};

// 🔄 Reset de contraseña con token
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ error: 'Token inválido o expirado' });

    const hashed = bcrypt.hashSync(newPassword, 10);
    user.password = hashed;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al resetear contraseña', details: err.message });
  }
};
