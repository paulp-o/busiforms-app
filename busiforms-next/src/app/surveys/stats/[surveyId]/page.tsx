"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Header from "@/components/layout/Header/Header";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

import { useParams } from "next/navigation";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function SurveyResultsPage() {
  interface SurveyData {
    questions: { id: string; text: string; visualizationType: string }[];
    title?: string;
    description?: string;
  }

  interface ResponseData {
    id: string;
    answers: { [key: string]: string };
  }

  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [responsesData, setResponsesData] = useState<ResponseData[] | null>(null);
  const { surveyId } = useParams();

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const surveyResponse = await axios.get(`http://localhost:3001/api/surveys/${surveyId}`);
        console.log(surveyResponse.data);
        setSurveyData(surveyResponse.data);
      } catch (error) {
        console.error("Error fetching survey data:", error);
      }
    };

    const fetchResponsesData = async () => {
      try {
        const responsesResponse = await axios.get(`http://localhost:3001/api/responses/${surveyId}`);
        console.log(responsesResponse.data);
        setResponsesData(responsesResponse.data);
      } catch (error) {
        console.error("Error fetching responses data:", error);
      }
    };

    fetchSurveyData();
    fetchResponsesData();
  }, [surveyId]);

  const surveyInfo = {
    title: "제목없는 설문지",
    date: "2025/01/08",
    target: {
      location: "서울시 강남구",
      age: "20-50",
      gender: "여성",
      total: "30,000",
    },
  };

  const generateBarChartData = (questionId: string) => {
    const labels: string[] = [];
    const data: number[] = [];

    responsesData?.forEach((response) => {
      const answer = response.answers[questionId];
      const index = labels.indexOf(answer);
      if (index === -1) {
        labels.push(answer);
        data.push(1);
      } else {
        data[index] += 1;
      }
    });

    return {
      labels,
      datasets: [
        {
          label: "Responses",
          data,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const generatePieChartData = (questionId: string) => {
    const labels: string[] = [];
    const data: number[] = [];

    responsesData?.forEach((response) => {
      const answer = response.answers[questionId];
      const index = labels.indexOf(answer);
      if (index === -1) {
        labels.push(answer);
        data.push(1);
      } else {
        data[index] += 1;
      }
    });

    return {
      labels,
      datasets: [
        {
          label: "Responses",
          data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const generateHistogramData = (questionId: string) => {
    const labels: string[] = [];
    const data: number[] = [];

    responsesData?.forEach((response) => {
      const answer = response.answers[questionId];
      const index = labels.indexOf(answer);
      if (index === -1) {
        labels.push(answer);
        data.push(1);
      } else {
        data[index] += 1;
      }
    });

    return {
      labels,
      datasets: [
        {
          label: "Responses",
          data,
          backgroundColor: "rgba(153, 102, 255, 0.6)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <div className="flex">
        {/* 좌측 사이드바 */}
        <div className="w-64 min-h-[calc(100vh-4rem)] bg-white border-r border-gray-100">
          <div className="p-5">
            {/* 설문지 정보 카드 */}
            <div className="bg-[#4F46E5] text-white rounded-lg p-5 mb-5">
              <div className="text-sm opacity-80 mb-1.5">{surveyInfo.date}</div>
              <div className="text-lg font-bold mb-3">{surveyData?.title || surveyInfo.title}</div>
              <div className="text-sm opacity-80">{surveyData?.description || "AI"}</div>
            </div>

            {/* charts*/}
            {/* <div className="space-y-3">
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
            </div> */}

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
          {surveyData && responsesData ? (
            <div>
              {/* <Suspense fallback={<LoadingSpinner />}>
                <SurveyDashboard surveyId={surveyId as string} />
              </Suspense> */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {surveyData.questions.map((question) => (
                  <div key={question.id} className="bg-white border border-gray-100 rounded-lg p-5">
                    <h3 className="text-lg font-bold mb-3">{question.text}</h3>
                    <div className="text-sm text-gray-500 mb-4">Visualization Type: {question.visualizationType}</div>
                    <div className="h-32 w-full bg-gray-100 rounded-lg">
                      {question.visualizationType === "bar_chart" && <Bar data={generateBarChartData(question.id)} />}
                      {question.visualizationType === "pie_chart" && <Pie data={generatePieChartData(question.id)} />}
                      {question.visualizationType === "histogram" && (
                        <Bar data={generateHistogramData(question.id)} options={{ scales: { x: { beginAtZero: true } } }} />
                      )}
                      {question.visualizationType !== "bar_chart" &&
                        question.visualizationType !== "pie_chart" &&
                        question.visualizationType !== "histogram" &&
                        responsesData.map((response) => (
                          <div key={response.id} className="border p-2 rounded">
                            {response.answers[question.id]}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>
    </div>
  );
}
