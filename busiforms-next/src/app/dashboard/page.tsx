import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header/Header";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userEmail={session.user.email} />

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900">대시보드</h1>
          <div className="mt-4">
            <p className="text-gray-600">
              환영합니다, {session.user.name || session.user.email}님!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
