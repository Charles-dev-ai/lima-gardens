const { authed, status, load, save } = require("./_lib");
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", req.method === "GET" ? "s-maxage=10, stale-while-revalidate=30" : "no-store");
  try {
    if (req.method === "GET") {
      if (!status().dbSet) return res.status(200).json({ config: null });
      return res.status(200).json({ config: await load() });
    }
    if (req.method === "PUT") {
      if (!authed(req.headers["x-admin-password"])) return res.status(401).json({ error: "Not signed in." });
      if (!status().dbSet) return res.status(500).json({ error: "No database connected. Add Upstash Redis under Storage in Vercel, connect it to this project, then redeploy." });
      let cfg = req.body; if (typeof cfg === "string") cfg = JSON.parse(cfg);
      if (!cfg || !Array.isArray(cfg.menu)) return res.status(400).json({ error: "Invalid data." });
      await save(cfg);
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: "Method not allowed" });
  } catch (e) { res.status(500).json({ error: e.message || "Server error" }); }
};
