import Joi from "joi";
import mongoose from "mongoose";

const SystemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, required: true },
  status: String,
  logs: [{ status: String, time: Date }],
});

export function validateSystem(system) {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    url: Joi.required(),
    type: Joi.string().required(),
  });

  return schema.validate(system);
}

export default mongoose.models.System || mongoose.model("System", SystemSchema);
