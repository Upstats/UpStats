import Joi from "joi";
import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
});

export function validateEmail(email) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
  });

  return schema.validate(email);
}

export default mongoose.models.Email || mongoose.model("Email", emailSchema);
