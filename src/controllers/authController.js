import { User } from '../models/User.js';
  import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

        if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

         if (!isMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res
      .cookie('jwtToken', token, {
        httpOnly: true,
        secure: false,             // poner true en producción con HTTPS

        maxAge: 3600000,            // 1 hora
      })
      .json({ message: 'Login exitoso' });
  } catch (err) {
               res.status(500).json({ error: 'Error al iniciar sesión', details: err.message });
  }
};
