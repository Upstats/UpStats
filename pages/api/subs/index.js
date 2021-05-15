import db from "../../../utils/db";
import Email, { validateEmail } from "../../../models/subscriber";
import withAuth from "../../../utils/auth";
export default async (req, res) => {
  await db();
  if (req.method === "GET") {
    withAuth(req, res, async () => {
      const emails = await Email.find().sort("email");
      res.send(emails);
    });
  } else if (req.method === "POST") {
    const { error } = validateEmail(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const email = new Email({
      email: req.body.email,
    });
    await email.save();

    res.send(email);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method Not Allowed`);
  }
};
