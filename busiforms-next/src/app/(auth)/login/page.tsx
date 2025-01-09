import LoginForm from "@/components/auth/LoginForm/LoginForm";
import { auth, signIn } from "@/auth";
import Button from "@/components/common/Button/Button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img className="mx-auto h-12 w-auto" src="/logo.png" alt="BusiForm" />
        </div>
        <LoginForm />

        <div className="mt-4">
          <form
            action={async () => {
              "use server";
              await signIn();
            }}
          >
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Google로 로그인
            </Button>
          </form>
        </div>

        <UserInfo />
      </div>
    </div>
  );
}

async function UserInfo() {
  const session = await auth();

  return session?.user ? (
    <div className="text-center text-sm text-gray-600">
      <p>로그인됨: {session.user.email}</p>
    </div>
  ) : null;
}
