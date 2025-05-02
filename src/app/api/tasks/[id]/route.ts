import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongodb";
import { Task } from "@/models/Task";
import { validateObjectId } from "@/utils/validateObjectId";

/**----------------------------------
 * @desc   Update Task
 * @route  /api/tasks/:id
 * @method PUT
 * @access private (only user himself)
-------------------------------------*/
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  connectToMongoDB();

  const userId = req.headers.get("x-user-id");
  const taskId = validateObjectId(params.id);

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
  { params }: { params: { id: string } }
) {
  connectToMongoDB();

  const userId = req.headers.get("x-user-id");
  const taskId = validateObjectId(params.id);

  const deletedTask = await Task.findOneAndDelete({
    _id: taskId,
    user: userId,
  });

  if (!deletedTask) {
    return NextResponse.json({ error: "Not found!" }, { status: 404 });
  }

  return NextResponse.json({}, { status: 204 });
}
