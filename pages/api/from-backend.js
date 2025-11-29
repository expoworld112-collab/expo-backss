export default function handler(req, res) {
  console.log("Frontend received:", req.body);

  res.status(200).json({
    success: true,
    message: "Frontend API received the backend call",
    received: req.body
  });
}
