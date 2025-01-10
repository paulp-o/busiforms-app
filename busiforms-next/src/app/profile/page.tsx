import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header/Header";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userEmail={session.user.email} />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "프로필 이미지"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl text-gray-500">
                    {(session.user.name || session.user.email || "U")[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {session.user.name || "이름 없음"}
              </h2>
              <p className="text-gray-600">{session.user.email}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">계정 정보</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  이메일
                </label>
                <p className="mt-1 text-sm text-gray-900">{session.user.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  계정 생성일
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date().toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  로그인 방식
                </label>
                <p className="mt-1 text-sm text-gray-900">Google 계정</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-6 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">활동 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">생성한 설문</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">응답 수집</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">최근 활동</p>
                <p className="mt-2 text-sm text-gray-900">없음</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}