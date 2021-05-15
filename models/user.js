import jwt from "jsonwebtoken";
import Joi from "joi";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.email === process.env.admin_email },
    process.env.jwtPrivateKey
  );
  return token;
};

export function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50),
    email: Joi.string().min(5).max(255).email(),
    password: Joi.string().min(5).max(255),
  });

  return schema.validate(user);
}

export default mongoose.models.User || mongoose.model("User", userSchema);
