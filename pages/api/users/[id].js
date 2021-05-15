import db from "../../../utils/db";
import withAuth from "../../../utils/auth";
import admin from "../../../utils/admin";
import User, { validateUser } from "../../../models/user";

export default async (req, res) => {
  await db();
  switch (req.method) {
    case "PUT":
      withAuth(req, res, async () => {
        admin(req, res);
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findByIdAndUpdate(req.query.id, {
          email: req.body.email.toLowerCase(),
        });

        if (!user)
          return res
            .status(404)
            .send("The user with the given ID was not found.");

        res.send(user);
      });
      break;
    case "DELETE":
      withAuth(req, res, async () => {
        admin(req, res);
        const user = await User.findByIdAndRemove(req.query.id);

        if (!user)
          return res
            .status(404)
            .send("The user with the given ID was not found.");

        res.send(user);
      });
      break;
    default:
      res.setHeader("Allow", ["DELETE", "PUT"]);
      res.status(405).end(`Method Not Allowed`);
  }
};
