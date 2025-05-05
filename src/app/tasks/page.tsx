import { deleteAction, saveAction, toggleAction } from "@/actions/tasks";
import { getCookieHeaderOrRedirect } from "@/lib/auth";
import { Task } from "@/types/Task";
import Link from "next/link";

const TasksPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ editingId: string; error: string }>;
}) => {
  const cookie = await getCookieHeaderOrRedirect();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
    cache: "no-store",
    headers: { cookie },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tasks!");
  }

  const tasks: Task[] = await response.json();

  const { editingId, error } = await searchParams;

  const editingTask = tasks.find((t) => t._id === editingId);

  return (
    <>
      <div className="max-w-xl mx-auto">
        {error && <p className="mb-4 text-red-600">{error}</p>}
        <form action={saveAction} className="flex mb-6">
          <input type="hidden" name="id" value={editingId ?? ""} />
          <input
            type="text"
            name="title"
            defaultValue={editingTask?.title ?? ""}
            placeholder="Task title..."
            className="flex-1 border px-3 py-2 rounded-l focus:ring"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 rounded-r"
          >
            {editingId ? "Update" : "Add"}
          </button>
        </form>
        <ul className="space-y-3">
          {tasks.map((t) => (
            <li
              key={t._id}
              className="flex justify-between items-center p-3 bg-white rounded shadow"
            >
              <form action={toggleAction} className="flex items-center">
                <input type="hidden" name="id" value={t._id} />
                <input
                  type="hidden"
                  name="completed"
                  value={String(t.completed)}
                />
                <input type="hidden" name="title" value={t.title} />
                <button type="submit" className="mr-3">
                  {t.completed ? "✅" : "◻️"}
                </button>
                <span
                  className={t.completed ? "line-through text-gray-500" : ""}
                >
                  {t.title}
                </span>
              </form>
              <div className="flex space-x-2">
                <Link href={`/tasks?editingId=${t._id}`}>✏️</Link>
                <form action={deleteAction}>
                  <input type="hidden" name="id" value={t._id} />
                  <button type="submit">🗑️</button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TasksPage;
