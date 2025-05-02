import { NextResponse } from "next/server";

/**----------------------------------
 * @desc   Logout User
 * @route  /api/auth/logout
 * @method POST
 * @access public
-------------------------------------*/
export async function POST() {
  const response = NextResponse.json(
    { message: "Logged out" },
    { status: 200 }
  );

  response.cookies.set({
    name: "token",
    value: "",
    maxAge: 0,
  });

  return response;
}
