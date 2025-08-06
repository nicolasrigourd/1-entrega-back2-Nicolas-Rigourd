import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  first_name:  { type: String, required: true },
  last_name:   { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  age:         { type: Number, required: true },
  password:    { type: String, required: true },
  cart:        { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', default: null },
  role:        { type: String, default: 'user', enum: ['user', 'admin'] },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null }
});

export const User = mongoose.model('User', userSchema);
