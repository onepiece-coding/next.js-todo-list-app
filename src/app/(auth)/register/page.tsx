import { registerAction } from "@/actions/auth";

const RegisterPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) => {
  const { error } = await searchParams;

  return (
    <main className="max-w-md mx-auto p-4">
      {error && <p className="mb-4 text-red-600">{error}</p>}
      <form action={registerAction} className="space-y-4">
        <h2 className="text-2xl font-bold">Register New User</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Register
        </button>
      </form>
    </main>
  );
};

export default RegisterPage;
