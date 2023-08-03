import db from "../../../utils/db";
import User, { validateUser } from "../../../models/user";
const bcrypt = require("bcrypt");
const _ = require("lodash");

export default async (req, res) => {
  await db();
  switch (req.method) {
    case "POST":
      const { error } = validateUser(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      let user = await User.findOne({ email: req.body.email.toLowerCase() });
      if (user && user.password)
        return res.status(400).send("User already registered.");
      else user = new User(_.pick(req.body, ["name", "email", "password"]));
      user.password = req.body.password;
      user.name = req.body.name;

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      const token = user.generateAuthToken();

      res
        .setHeader("x-auth-token", token)
        .send(_.pick(user, ["_id", "name", "email"]));
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method Not Allowed`);
  }
};
