import Joi from "joi";
import mongoose from "mongoose";

const ConfigSchema = new mongoose.Schema({
  mailing: { type: Boolean, required: true },
});

export function validateConfig(config) {
  const schema = Joi.object({
    mailing: Joi.boolean().required(),
  });

  return schema.validate(config);
}

export default mongoose.models.Config || mongoose.model("Config", ConfigSchema);
