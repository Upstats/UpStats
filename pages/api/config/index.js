import db from "../../../utils/db";
import withAuth from "../../../utils/auth";
import Config, { validateConfig } from "../../../models/config";
export default async (req, res) => {
  await db();
  if (req.method === "GET") {
    const configs = await Config.find();
    console.log("😀", configs);
    res.send(configs[0]);
  } else if (req.method === "PUT") {
    withAuth(req, res, async () => {
      const { error } = validateConfig(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      let config = await Config.find();
      if (!config.length) {
        let config = new Config({
          mailing: req.body.mailing,
        });
        await config.save();
        return res.send(config);
      }
      config[0].mailing = req.body.mailing;
      config[0].save();

      if (!config)
        return res
          .status(404)
          .send("The config with the given ID was not found.");

      res.send(config);
    });
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method Not Allowed`);
  }
};
