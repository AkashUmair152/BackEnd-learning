import mongoose, { Types } from "mongoose";

const userSchema = new mongoose.Schema({});

{
  username: {
    Type: String;
    require: true;
    unique: true;
    lowercase: true;
  }
  email: {
    Type: String;
    require: true;
    lowercase: true;
    unique: true;
  }
  password: {
    Type: String;
    require: [true, "password is required"];
  }
}
{
  timestamps: true;
}

export const User = mongoose.model("User", userSchema);
