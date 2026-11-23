const crypto = require("crypto");
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
const KEY = "lima:config";
exports.status = () => ({ passwordSet: !!process.env.ADMIN_PASSWORD, dbSet: !!(URL_ && TOKEN) });
async function redis(cmd) {
  const r = await fetch(URL_, { method: "POST", headers: { Authorization: "Bearer " + TOKEN }, body: JSON.stringify(cmd) });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error(j.error || "Database error");
  return j.result;
}
exports.load = async () => { const v = await redis(["GET", KEY]); return v ? JSON.parse(v) : null; };
exports.save = (cfg) => redis(["SET", KEY, JSON.stringify(cfg)]);
exports.authed = (pw) => {
  const real = process.env.ADMIN_PASSWORD || "";
  if (!real || typeof pw !== "string") return false;
  const a = crypto.createHash("sha256").update(pw).digest(), b = crypto.createHash("sha256").update(real).digest();
  return crypto.timingSafeEqual(a, b);
};
