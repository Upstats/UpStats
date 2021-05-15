import db from "../../../utils/db";
import Email from "../../../models/subscriber";
export default async (req, res) => {
  await db();
  if (req.method === "GET") {
    const emails = await Email.find().sort("email");

    res.send(emails.length);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method Not Allowed`);
  }
};
