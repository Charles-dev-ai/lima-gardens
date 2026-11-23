const { authed, status } = require("./_lib");
module.exports = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const st = status();
  if (req.method === "GET") return res.status(200).json(st);
  if (!st.passwordSet) return res.status(500).json({ error: "ADMIN_PASSWORD is not set in Vercel. Add it under Settings > Environment Variables, then redeploy." });
  let body = req.body; if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  if (!authed(body && body.password)) return res.status(401).json({ error: "Wrong password." });
  res.status(200).json({ ok: true, dbSet: st.dbSet });
};
