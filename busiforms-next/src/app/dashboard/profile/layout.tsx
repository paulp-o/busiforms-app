import React from "react";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { fetchUserDetails, getUserDetailsQueryKey } from "../queries";
import { getQueryClient } from "@/lib/get-query-client";
import ProfilePage from "./page";
import { dehydrate } from "@tanstack/react-query";

export default async function ProfilePageLayout() {
  const session = await auth();
  if (!session) return <p>로그인이 필요합니다.</p>;
  const userId = session.user?.id as string;
  const queryClient = getQueryClient();

  // 서버에서 데이터를 미리 가져오기
  await queryClient.prefetchQuery({
    queryKey: getUserDetailsQueryKey(userId),
    queryFn: async () => fetchUserDetails(userId),
  });

  // React Query 상태 직렬화
  const dehydratedState = dehydrate(queryClient);

  return (
    <div>
      <ProfilePage dehydratedState={dehydratedState} session={session} />
    </div>
  );
}
