import db from "../../../utils/db";
import System, { validateSystem } from "../../../models/system";
import withAuth from "../../../utils/auth";

export default async (req, res) => {
  await db();
  switch (req.method) {
    case "GET":
      try {
        const system = await System.findById(req.query.id);
        if (!system)
          return res
            .status(404)
            .send("The system with the given ID was not found.");

        res.status(200).send(system);
      } catch {
        res.status(400).send("Invalid Object Id");
      }
      break;
    case "PUT":
      await withAuth(req, res, async () => {
        const { error } = validateSystem(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const system_updated = await System.findByIdAndUpdate(
          req.query.id,
          {
            name: req.body.name,
            url: req.body.url,
            type: req.body.type,
          },
          { new: true }
        );

        if (!system_updated)
          return res
            .status(404)
            .send("The system with the given ID was not found.");

        res.send(system_updated);
      });
      break;
    case "DELETE":
      await withAuth(req, res, async () => {
        const system_deleted = await System.findByIdAndRemove(req.query.id);

        if (!system_deleted)
          return res
            .status(404)
            .send("The system with the given ID was not found.");

        res.send(system_deleted);
      });
      break;
    default:
      res.setHeader("Allow", ["GET", "DELETE", "PUT"]);
      res.status(405).end(`Method Not Allowed`);
  }
};
