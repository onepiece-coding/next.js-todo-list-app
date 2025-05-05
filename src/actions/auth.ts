// app/actions/auth.ts
"use server";
import { connectToMongoDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function registerAction(formData: FormData) {
  connectToMongoDB();

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username) {
    return redirect(
      `/register?error=${encodeURIComponent("Username is required!")}`
    );
  }

  if (!password) {
    return redirect(
      `/register?error=${encodeURIComponent("Password is required!")}`
    );
  }

  const exists = await User.findOne({ username });
  if (exists) {
    return redirect(
      `/register?error=${encodeURIComponent("User already exists!")}`
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await new User({ username, password: hashedPassword }).save();

  redirect("/login");
}

export async function loginAction(formData: FormData) {
  connectToMongoDB();

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const user = await User.findOne({ username });
  if (!user) {
    return redirect(
      `/login?error=${encodeURIComponent("Invalid credentials")}`
    );
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return redirect(
      `/login?error=${encodeURIComponent("Invalid credentials")}`
    );
  }

  const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  (await cookies()).set({
    name: "token",
    value: token,
    httpOnly: true, // Prevents access via JavaScript (more secure)
    secure:
      process.env.NODE_ENV ===
      "production" /* Only send over HTTPS in production */,
    sameSite: "strict", // Prevents CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
  });

  redirect("/tasks");
}

export async function logoutAction() {
  (await cookies()).delete("token");
  redirect("/login");
}
