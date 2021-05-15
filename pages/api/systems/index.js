// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import db from "../../../utils/db";
import System, { validateSystem } from "../../../models/system";
import withAuth from "../../../utils/auth";

export default async (req, res) => {
  await db();
  switch (req.method) {
    case "GET":
      const systems = await System.find().sort("name");
      res.status(200).send(systems);
      break;
    case "POST":
      await withAuth(req, res, async () => {
        const { error } = validateSystem(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const system = new System({
          name: req.body.name,
          url: req.body.url,
          type: req.body.type,
          status: "up",
        });
        await system.save();
        res.send(system);
      });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method Not Allowed`);
  }
};
