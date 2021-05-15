import db from "../../../utils/db";
import Email from "../../../models/subscriber";
export default async (req, res) => {
  await db();
  if (req.method === "DELETE") {
    const email = await Email.findByIdAndRemove(req.query.id);

    if (!email)
      return res.status(404).send("The email with the given ID was not found.");

    res.send(email);
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method Not Allowed`);
  }
};
