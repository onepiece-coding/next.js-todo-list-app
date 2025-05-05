import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcrypt";

/**----------------------------------
 * @desc   Register New User
 * @route  /api/auth/register
 * @method POST
 * @access public
-------------------------------------*/
export async function POST(req: Request) {
  await connectToMongoDB();

  const { username, password } = await req.json();

  const exists = await User.findOne({ username });
  if (exists) {
    return NextResponse.json({ error: "User exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await new User({ username, password: hashedPassword }).save();

  return NextResponse.json({ message: "Registered" }, { status: 201 });
}
