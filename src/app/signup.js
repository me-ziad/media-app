// pages/api/signup.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await axios.post(
      "https://linked-posts.routemisr.com/users/signup",
      req.body
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || "Registration failed";
    res.status(status).json({ error: message });
  }
}