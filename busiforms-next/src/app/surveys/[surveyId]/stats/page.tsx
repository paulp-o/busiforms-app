import { Suspense } from 'react';
import SurveyDashboard from '@/components/dashboard/SurveyDashboard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Header from '@/components/layout/Header';

export default function SurveyResultsPage({ params }: { params: { id: string } }) {
  const pageInfo = {
    title: "설문 결과 대시보드",
    description: "이 페이지에서는 설문 응답에 대한 종합적인 분석과 시각화된 결과를 확인할 수 있습니다."
  };

  const surveyInfo = {
    title: "제목없는 설문지",
    date: "2025/01/08",
    target: {
      location: "서울시 강남구",
      age: "20-50",
      gender: "여성",
      total: "30,000"
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header pageInfo={pageInfo} />
      <div className="flex">
        {/* 좌측 사이드바 */}
        <div className="w-64 min-h-[calc(100vh-4rem)] bg-white border-r border-gray-100">
          <div className="p-5">
            {/* 설문지 정보 카드 */}
            <div className="bg-[#4F46E5] text-white rounded-lg p-5 mb-5">
              <div className="text-sm opacity-80 mb-1.5">{surveyInfo.date}</div>
              <div className="text-lg font-bold mb-3">{surveyInfo.title}</div>
              <div className="text-sm opacity-80">AI</div>
            </div>

            {/* 설문 대상 정보 */}
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-900">설문조건</div>
              <div className="space-y-2.5">
                <div className="border-b border-gray-50 pb-2">
                  <div className="text-xs text-gray-500 mb-0.5">타겟지역</div>
                  <div className="text-sm">{surveyInfo.target.location}</div>
                </div>
                <div className="border-b border-gray-50 pb-2">
                  <div className="text-xs text-gray-500 mb-0.5">타겟연령</div>
                  <div className="text-sm">{surveyInfo.target.age}</div>
                </div>
                <div className="border-b border-gray-50 pb-2">
                  <div className="text-xs text-gray-500 mb-0.5">타겟성별</div>
                  <div className="text-sm">{surveyInfo.target.gender}</div>
                </div>
                <div className="border-b border-gray-50 pb-2">
                  <div className="text-xs text-gray-500 mb-0.5">전체인원</div>
                  <div className="text-sm">{surveyInfo.target.total}</div>
                </div>
              </div>
            </div>

            {/* 버튼들 */}
            <div className="mt-6 space-y-2">
              <button className="w-full bg-[#4F46E5] text-white py-2.5 rounded-md text-sm font-medium hover:bg-[#4338CA] transition-colors">
                설문지 수정하기
              </button>
              <button className="w-full bg-gray-50 text-gray-700 py-2.5 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors">
                결과 복사하기
              </button>
              <button className="w-full bg-gray-50 text-gray-700 py-2.5 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors">
                결과 공유하기
              </button>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 p-5">
          <Suspense fallback={<LoadingSpinner />}>
            <SurveyDashboard surveyId={params.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 