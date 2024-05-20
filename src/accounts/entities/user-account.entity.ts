import * as mongoose from 'mongoose';

export const UserAccountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', }, 
  firstName: { type: String, required: true, maxlength: 100 },
  lastName: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, maxlength: 100, unique: true },
  phone: { type: String, maxlength: 16 },
  password: { type: String, required: true, maxlength: 50 },
  birthday: { type: Date, required: true },
});

export interface UserAccount extends mongoose.Document {
  user: mongoose.Types.ObjectId; 
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  birthday: Date;
}
