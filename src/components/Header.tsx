import { logoutAction } from "@/actions/auth";
import { cookies } from "next/headers";
import Link from "next/link";

const Header = async () => {
  const isAuth = (await cookies()).get("token")?.value;

  return (
    <header className="bg-white shadow p-4 flex justify-between">
      <h1 className="font-bold text-xl">📝 ToDoApp</h1>
      <nav className="space-x-4">
        {!isAuth ? (
          <>
            <Link href={"/register"} className="hover:underline">
              Register
            </Link>
            <Link href={"/login"} className="hover:underline">
              Login
            </Link>
          </>
        ) : (
          <>
            <Link href={"/tasks"} className="hover:underline">
              My Tasks
            </Link>
            <form action={logoutAction} className="inline">
              <button type="submit" className="hover:underline">
                Logout
              </button>
            </form>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
