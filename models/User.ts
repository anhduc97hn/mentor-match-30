import 'dotenv/config';
import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
const JWT_RESET_PASSWORD = process.env.JWT_RESET_PASSWORD as string; 

export interface IUser extends Document {
  email: string;
  password?: string; // Optional after toJSON, but required for schema
  createdAt: Date;
  updatedAt: Date;
}

// Interface for instance methods
export interface IUserMethods {
  toJSON(): Omit<IUser, 'password'>;
  generateToken(): Promise<string>;
  generateResetToken(): Promise<string>;
}

// Combine Document, Methods, and optionally Statics (empty here)
type UserModelType = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModelType, IUserMethods>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function (this: IUser & IUserMethods): Omit<IUser, 'password'> {
  // Use toObject() for Mongoose documents
  const user = this.toObject(); 
  delete user.password;
  return user as Omit<IUser, 'password'>;
};

userSchema.methods.generateToken = async function (this: IUser & IUserMethods): Promise<string> {
  const accessToken = await jwt.sign(
    { _id: this._id, email: this.email },
    JWT_SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );
  return accessToken;
};

userSchema.methods.generateResetToken = async function (this: IUser & IUserMethods): Promise<string> {
  const resetToken = await jwt.sign(
    { _id: this._id, email: this.email },
    JWT_RESET_PASSWORD,
    {
      expiresIn: "10m",
    }
  );
  return resetToken;
};

const User = mongoose.model<IUser, UserModelType>("User", userSchema);
export default User;