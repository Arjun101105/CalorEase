import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function verifyToken() { // 👈 Make it async
  try {
    const cookieStore = await cookies(); // ✅ Await cookies() properly
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}
