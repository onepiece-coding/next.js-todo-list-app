"use server";

import { getCookieHeaderOrRedirect } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function saveAction(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;

  if (!title) {
    return redirect(`/tasks?error=${encodeURIComponent("Title is required!")}`);
  }

  const url = `${API_BASE_URL}/api/tasks${id ? `/${id}` : ""}`;

  const cookie = await getCookieHeaderOrRedirect();

  await fetch(url, {
    method: id ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
      cookie,
    },
    body: JSON.stringify({
      title,
      completed: id ? false : undefined,
    }),
    credentials: "include",
  });

  redirect("/tasks");
}

export async function toggleAction(formData: FormData) {
  const id = formData.get("id") as string;
  const current = formData.get("completed") === "true";
  const title = formData.get("title") as string;

  if (!id) return;

  const cookie = await getCookieHeaderOrRedirect();

  await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      cookie,
    },
    body: JSON.stringify({ title, completed: !current }),
  });

  revalidatePath("/tasks");
}

export async function deleteAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  const cookie = await getCookieHeaderOrRedirect();

  await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
    method: "DELETE",
    headers: {
      cookie,
    },
  });

  revalidatePath("/tasks");
}
