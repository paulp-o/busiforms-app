"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header/Header";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  useEffect(() => {
    if (!loading && !user) {
      // 로그인이 안 된 상태임
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userEmail={user.email} />

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900">대시보드</h1>
          <div className="mt-4">
            <p className="text-gray-600">환영합니다, {user.username}님!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
