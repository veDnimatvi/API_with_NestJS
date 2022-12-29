import { Schema, Document } from 'mongoose';

const UserSchema = new Schema(
  {
    name: String,
    email: String,
    number: String,
    password: String,
    valid: Boolean,
  },
  {
    collection: 'users',
  },
);

export { UserSchema };
export interface User extends Document {
  name: string;
  email: string;
  number: string;
  password: string;
  valid: boolean;
}
