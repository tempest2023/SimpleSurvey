import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import { Schema, model, Document } from 'mongoose';
import { UserPermission, PermissionSet } from '../schema/user.schema';

export interface UserInput {
  parent_id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  permission: PermissionSet;
}

export interface UserNameInput {
  firstName: string;
  lastName: string;
}

export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<Boolean>;
}


const userSchema = new mongoose.Schema(
  {
    
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    parent_id: { type: String, required: true},
    role: {
      type: String,
      enum: ['admin', 'clinician', 'patient'],
      required: true
    },
    parentId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  permission: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length === 0 || v.every(e => Object.values(UserPermission).includes(e));
      },
      message: props => `${props.value} is not a valid permission.`
    }
  }
  },
  {
    timestamps: true,
  }
);



userSchema.pre("save", async function (next) {
  // let user = this as UserDocument;

  let user = this;
  if (!user.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));

  const hash = await bcrypt.hashSync(user.password, salt);

  user.password = hash;

  return next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  if (this.role === 'admin' || this.role === 'clinician' || this.role === 'patient') {
    return next();
  }

  const err = new Error('Invalid role');
  err.name = 'ValidationError';
  next(err);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
