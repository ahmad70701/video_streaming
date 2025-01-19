import { Schema, model } from 'mongoose';

const userSchema = Schema({
  firstName: { type: String, required: true },
  lastName: { type: String,},
  userName: { type: String, required: true, unique:true },
  email: { type: String, required: true, unique: true },
  userStatus: { type: String, },
  userRole: { type: String, },
  password: { type: String, required: true },
}, { timestamps: true });

export default model('User', userSchema);
