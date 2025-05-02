import { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function validateObjectId(id: string) {
  if (!Types.ObjectId.isValid(id!)) {
    return NextResponse.json({ error: "Invalid Id!" }, { status: 400 });
  }

  return id;
}
