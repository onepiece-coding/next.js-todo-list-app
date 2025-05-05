import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getCookieHeaderOrRedirect() {
  const cookie = (await headers()).get("cookie") || "";
  if (!cookie) redirect("/login");
  return cookie;
}
