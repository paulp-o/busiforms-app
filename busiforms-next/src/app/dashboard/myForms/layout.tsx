import { dehydrate } from "@tanstack/react-query";
import MyFormList from "./page";
import { getQueryClient } from "@/lib/get-query-client";
import { fetchForms, getFormsQueryKey } from "../queries";
import { auth } from "@/auth";
import MyFormsNavigationBar from "./MyFormsNavigationBar";

export default async function MyFormsPageLayout() {
  const session = await auth();
  const userId = session?.user?.id as string;
  const queryClient = getQueryClient();

  // 서버에서 데이터를 미리 가져오기
  await queryClient.prefetchQuery({
    queryKey: getFormsQueryKey(userId),
    queryFn: async () => fetchForms(userId),
  });

  // React Query 상태 직렬화
  const dehydratedState = dehydrate(queryClient);

  return (
    <div>
      <MyFormsNavigationBar userId={userId} />
      <div className="p-3">
        {/* <h1 className="text-2xl font-bold mb-4">Form Dashboard</h1> */}
        {/* 클라이언트 컴포넌트에 직렬화된 상태 전달 */}
        <MyFormList dehydratedState={dehydratedState} userId={userId} />
      </div>
    </div>
  );
}
