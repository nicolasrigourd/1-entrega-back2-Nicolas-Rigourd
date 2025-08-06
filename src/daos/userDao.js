import { User } from '../models/User.js';

class UserDao {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findById(id) {
    return await User.findById(id);
  }

  async createUser(userData) {
    return await User.create(userData);
  }

  async updatePassword(userId, newPassword) {
    return await User.findByIdAndUpdate(
      userId,
      { password: newPassword },
      { new: true }
    );
  }

  async updateResetToken(email, token, expiration) {
    return await User.findOneAndUpdate(
      { email },
      {
        resetPasswordToken: token,
        resetPasswordExpires: expiration,
      },
      { new: true }
    );
  }

  async findByResetToken(token) {
    return await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
  }
}

export default new UserDao();
