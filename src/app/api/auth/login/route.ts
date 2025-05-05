import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**----------------------------------
 * @desc   Login User
 * @route  /api/auth/login
 * @method POST
 * @access public
-------------------------------------*/
export async function POST(req: Request) {
  await connectToMongoDB();

  const { username, password } = await req.json();

  const user = await User.findOne({ username });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  const response = NextResponse.json({ message: "Logged in" }, { status: 200 });

  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true, // Prevents access via JavaScript (more secure)
    secure:
      process.env.NODE_ENV ===
      "production" /* Only send over HTTPS in production */,
    sameSite: "lax", // Prevents CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
    path: "/",
  });

  return response;
}
