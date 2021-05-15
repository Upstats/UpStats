import db from "../../../utils/db";
import User from "../../../models/user";
import withAuth from "../../../utils/auth";
export default async (req, res) => {
  await db();
  switch (req.method) {
    case "GET":
      withAuth(req, res, async () => {
        const user = await User.findById(req.user._id).select("-password");

        res.send(user);
      });
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method Not Allowed`);
  }
};
