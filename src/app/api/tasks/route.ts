import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongodb";
import { Task } from "@/models/Task";

/**----------------------------------
 * @desc   Get User's Tasks
 * @route  /api/tasks
 * @method GET
 * @access private (logged in user)
-------------------------------------*/
export async function GET(req: Request) {
  connectToMongoDB();

  const userId = req.headers.get("x-user-id");
  const tasks = await Task.find({ user: userId }).sort("-createdAt");
  return NextResponse.json(tasks, { status: 200 });
}

/**----------------------------------
 * @desc   Add New Task
 * @route  /api/tasks
 * @method POST
 * @access private (logged in user)
-------------------------------------*/
export async function POST(req: Request) {
  connectToMongoDB();

  const userId = req.headers.get("x-user-id");
  const { title } = await req.json();
  const task = await new Task({ title, user: userId }).save();
  return NextResponse.json(task, { status: 201 });
}
