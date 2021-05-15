export default async (req, res) => {
  if (!req.user.email === process.env.admin_email)
    return res.status(403).send("Access denied.");
};
