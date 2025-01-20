import { dehydrate } from "@tanstack/react-query";
import SurveyList from "../SurveyList";
import { getQueryClient } from "@/lib/get-query-client";
import { fetchSurveys, getSurveysQueryKey } from "../queries";
import MyFormsNavigationBar from "./NavigationBar";
import { auth } from "@/auth";

export default async function MyFormsPage() {
  const session = await auth();
  const userId = session?.user?.id as string;
  const queryClient = getQueryClient();

  // 서버에서 데이터를 미리 가져오기
  await queryClient.prefetchQuery({
    queryKey: getSurveysQueryKey(userId),
    queryFn: async () => fetchSurveys(userId),
  });

  // React Query 상태 직렬화
  const dehydratedState = dehydrate(queryClient);

  return (
    <div>
      <MyFormsNavigationBar userId={userId} />
      <div className="p-3">
        {/* <h1 className="text-2xl font-bold mb-4">Survey Dashboard</h1> */}
        {/* 클라이언트 컴포넌트에 직렬화된 상태 전달 */}
        <SurveyList dehydratedState={dehydratedState} userId={userId} />
      </div>
    </div>
  );
}
