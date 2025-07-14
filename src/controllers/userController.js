import { User } from '../models/User.js';
import bcrypt from 'bcrypt';

// Registro 
export const registerUser = async (req, res) => {
     try {
    const { first_name, last_name, email, age, password } = req.body;

    const existingUser = await User.findOne({ email });
       if (existingUser) return res.status(400).json({ error: 'El usuario ya existe' });

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    });

    await newUser.save();

        res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (err) {
        res.status(500).json({ error: 'Error al registrar usuario', details: err.message });
  }
};

// Listar ususarios

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');     // ocultamos contraseña
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Obtener ususario x id

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
            if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
       res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

// Modif ususario x id

export const updateUser = async (req, res) => {
  try {
    const { first_name, last_name, age, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
        { first_name, last_name, age, role },
      { new: true }
    ).select('-password');

         if (!updatedUser) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ message: 'Usuario actualizado', user: updatedUser });
  } catch (err) {
       res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

// Eliminar usuario x id

export const deleteUser = async (req, res) => {
  try {
         const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'Usuario no encontrado' });

         res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};
