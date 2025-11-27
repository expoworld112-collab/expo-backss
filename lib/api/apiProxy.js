export default function corsAndProxy(req, res, backendPath) {
  const allowedOrigins = ["https://efronts.vercel.app", "http://localhost:3000"];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  return fetch(`https://ebacks-pied.vercel.app${backendPath}`, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: ["GET"].includes(req.method) ? undefined : JSON.stringify(req.body),
  })
    .then(async (r) => {
      const data = await r.json().catch(() => ({}));
      return res.status(r.status).json(data);
    })
    .catch((err) => {
      console.error("Proxy error:", err);
      return res.status(500).json({ error: "Internal server error" });
    });
}
