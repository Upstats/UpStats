import db from "../../../utils/db";
import System from "../../../models/system";
export default async (req, res) => {
  await db();

  let isOperational = false;
  let outageCount = 0;
  const systems = await System.find();
  for (let system of systems) {
    isOperational = system.status === "up" ? true : false;
    if (!isOperational) outageCount += 1;
  }

  res.status(200).send({
    operational: isOperational,
    ...(!isOperational && { outageCount }),
  });
};
