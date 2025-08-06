import userDao from '../daos/userDao.js';

class UserRepository {
  async getUserByEmail(email) {
    return await userDao.findByEmail(email);
  }

  async getUserById(id) {
    return await userDao.findById(id);
  }

  async createUser(userData) {
    return await userDao.createUser(userData);
  }

  async updateUserPassword(userId, hashedPassword) {
    return await userDao.updatePassword(userId, hashedPassword);
  }

  async saveResetToken(email, token, expiration) {
    return await userDao.updateResetToken(email, token, expiration);
  }

  async getUserByResetToken(token) {
    return await userDao.findByResetToken(token);
  }
}

export default new UserRepository();
