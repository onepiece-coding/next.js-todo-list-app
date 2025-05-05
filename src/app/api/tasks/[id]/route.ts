import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongodb";
import { Task } from "@/models/Task";
import mongoose from "mongoose";

/**----------------------------------
 * @desc   Update Task
 * @route  /api/tasks/:id
 * @method PUT
 * @access private (only user himself)
-------------------------------------*/
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToMongoDB();

  const { id: taskId } = await params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return NextResponse.json({ error: "Invalid Id!" }, { status: 400 });
  }

  const userId = req.headers.get("x-user-id");
  const { title, completed } = await req.json();

  const updatedTask = await Task.findByIdAndUpdate(
    {
      _id: taskId,
      user: userId,
    },
    { title, completed },
    { new: true }
  );

  if (!updatedTask) {
    return NextResponse.json({ error: "Not found!" }, { status: 404 });
  }

  return NextResponse.json(updatedTask, { status: 200 });
}

/**----------------------------------
 * @desc   Delete Task
 * @route  /api/tasks/:id
 * @method DELETE
 * @access private (only user himself)
-------------------------------------*/
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectToMongoDB();

  const { id: taskId } = await params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return NextResponse.json({ error: "Invalid Id!" }, { status: 400 });
  }

  const userId = req.headers.get("x-user-id");

  const deletedTask = await Task.findOneAndDelete({
    _id: taskId,
    user: userId,
  });

  if (!deletedTask) {
    return NextResponse.json({ error: "Not found!" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "Task deleted successfully" },
    { status: 200 }
  );
}
