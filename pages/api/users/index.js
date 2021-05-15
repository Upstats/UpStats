import db from "../../../utils/db";
import withAuth from "../../../utils/auth";
import admin from "../../../utils/admin";
import User, { validateUser } from "../../../models/user";
const _ = require("lodash");

export default async (req, res) => {
  await db();
  switch (req.method) {
    case "GET":
      withAuth(req, res, async () => {
        admin(req, res);
        const users = await User.find().sort("name");
        res.send(users);
      });
      break;
    case "POST":
      withAuth(req, res, async () => {
        admin(req, res);
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({ email: req.body.email.toLowerCase() });
        if (user) return res.status(400).send("User already registered.");

        user = new User({ email: req.body.email });
        await user.save();

        res.send(_.pick(user, ["_id", "email"]));
      });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method Not Allowed`);
  }
};
