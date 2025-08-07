
import bcrypt from 'bcrypt';
import UserDao from '../daos/userDao.js';
import UserDTO from '../dtos/user.dto.js';

class UserManager {
  async register(userData) {
    const existingUser = await UserDao.findByEmail(userData.email);
    if (existingUser) throw new Error('El usuario ya existe');

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await UserDao.createUser({
      ...userData,
      password: hashedPassword,
    });

    return new UserDTO(newUser);
  }

  async login(email, password) {
    const user = await UserDao.findByEmail(email);
    if (!user) throw new Error('Usuario no encontrado');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Contraseña incorrecta');

    return new UserDTO(user);
  }

  async getById(id) {
    const user = await UserDao.findById(id);
    if (!user) throw new Error('Usuario no encontrado');

    return new UserDTO(user);
  }

  async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await UserDao.updatePassword(userId, hashedPassword);
  }

  async saveResetToken(email, token, expiration) {
    return await UserDao.updateResetToken(email, token, expiration);
  }

  async getUserByResetToken(token) {
    return await UserDao.findByResetToken(token);
  }
}

export default new UserManager();
