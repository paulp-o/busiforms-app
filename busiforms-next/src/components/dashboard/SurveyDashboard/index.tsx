"use client";

import { FC, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import { Bar, Pie, Line, Scatter, Radar } from "react-chartjs-2";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export function TagCloud({ words }: { words: { text: string; value: number }[] }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {words.map((word, index) => (
        <span
          key={index}
          className="px-3 py-1 bg-blue-100 rounded-full"
          style={{
            fontSize: `${Math.max(0.8, Math.min(2, word.value / 30))}rem`,
          }}
        >
          {word.text}
        </span>
      ))}
    </div>
  );
}

// Chart.js 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale);

type SurveyResult = {
  question: string;
  visualization_tag: string;
  data: {
    labels: string[];
    values: number[] | { text: string; value: number }[] | number[][] | string[][];
  };
};

interface SurveyDashboardProps {
  surveyId: string;
}

// 요약 통계 더미 데이터 타입 정의
type SurveySummary = {
  totalResponses: number;
  averageSatisfaction: {
    current: number;
    change: number;
    trend: "up" | "down" | "same";
  };
  completionRate: {
    current: number;
    change: number;
    trend: "up" | "down" | "same";
  };
  averageTime: {
    current: number;
    change: number;
    trend: "up" | "down" | "same";
  };
};

// 요약 통계 더미 데이터
const dummySummary: SurveySummary = {
  totalResponses: 100,
  averageSatisfaction: {
    current: 4.2,
    change: 0.3,
    trend: "up",
  },
  completionRate: {
    current: 89,
    change: 2,
    trend: "down",
  },
  averageTime: {
    current: 4.5,
    change: 0,
    trend: "same",
  },
};

// 트렌드에 따른 스타일 및 아이콘 반환 함수
const getTrendDisplay = (trend: "up" | "down" | "same", change: number) => {
  switch (trend) {
    case "up":
      return {
        color: "text-green-600",
        icon: "↑",
        text: `${change} 증가`,
      };
    case "down":
      return {
        color: "text-red-600",
        icon: "↓",
        text: `${change} 감소`,
      };
    case "same":
      return {
        color: "text-gray-600",
        icon: "←",
        text: "변화없음",
      };
  }
};

export default function SurveyDashboard({ surveyId }: SurveyDashboardProps) {
  const [results, setResults] = useState<SurveyResult[]>([]);
  const [summary, setSummary] = useState<SurveySummary>(dummySummary);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // TODO: API 연동
        setResults(dummyData);
        setSummary(dummySummary);
      } catch (error) {
        console.error("Failed to fetch survey results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [surveyId]);

  const renderChart = (result: SurveyResult) => {
    const { visualization_tag, data } = result;
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            padding: 15,
            usePointStyle: true,
            font: {
              size: 11,
              family: "Inter",
            },
          },
        },
        title: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 11,
              family: "Inter",
            },
          },
        },
        y: {
          grid: {
            color: "#f1f5f9",
          },
          ticks: {
            font: {
              size: 11,
              family: "Inter",
            },
          },
        },
      },
    };

    switch (visualization_tag) {
      case "bar_chart":
        return (
          <Bar
            data={{
              labels: data.labels,
              datasets: [
                {
                  label: result.question,
                  data: data.values as number[],
                  backgroundColor: "rgba(75, 192, 192, 0.5)",
                },
              ],
            }}
            options={commonOptions}
          />
        );

      case "pie_chart":
        return (
          <Pie
            data={{
              labels: data.labels,
              datasets: [
                {
                  label: result.question,
                  data: data.values as number[],
                  backgroundColor: ["rgba(255, 99, 132, 0.5)", "rgba(54, 162, 235, 0.5)", "rgba(255, 206, 86, 0.5)", "rgba(75, 192, 192, 0.5)"],
                },
              ],
            }}
            options={commonOptions}
          />
        );

      case "line_graph":
        return (
          <Line
            data={{
              labels: data.labels,
              datasets: [
                {
                  label: result.question,
                  data: data.values as number[],
                  borderColor: "rgba(75, 192, 192, 1)",
                  fill: false,
                },
              ],
            }}
            options={commonOptions}
          />
        );

      case "scatter_plot":
        return (
          <Scatter
            data={{
              datasets: [
                {
                  label: result.question,
                  data: (data.values as number[]).map((v, i) => ({
                    x: i,
                    y: v,
                  })),
                  backgroundColor: "rgba(255, 99, 132, 0.5)",
                },
              ],
            }}
            options={commonOptions}
          />
        );

      case "radar_chart":
        return (
          <Radar
            data={{
              labels: data.labels,
              datasets: [
                {
                  label: result.question,
                  data: data.values as number[],
                  backgroundColor: "rgba(153, 102, 255, 0.2)",
                  borderColor: "rgba(153, 102, 255, 1)",
                },
              ],
            }}
            options={commonOptions}
          />
        );

      case "stacked_bar_chart":
        return (
          <Bar
            data={{
              labels: data.labels,
              datasets: (data.values as unknown as number[][]).map((dataset, index) => ({
                label: `데이터셋 ${index + 1}`,
                data: dataset,
                backgroundColor: `rgba(${75 + index * 40}, 192, ${192 - index * 40}, 0.5)`,
              })),
            }}
            options={{
              ...commonOptions,
              scales: {
                x: { stacked: true },
                y: { stacked: true },
              },
            }}
          />
        );

      case "histogram":
        return (
          <Bar
            data={{
              labels: data.labels,
              datasets: [
                {
                  label: result.question,
                  data: data.values as number[],
                  backgroundColor: "rgba(75, 192, 192, 0.5)",
                },
              ],
            }}
            options={{
              ...commonOptions,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        );

      case "box_plot":
        return (
          <div className="flex items-center justify-center p-4">
            {(data.values as unknown as number[][]).map((dataset, index) => (
              <div key={index} className="flex flex-col items-center mx-4">
                <div className="text-sm mb-2">{data.labels[index]}</div>
                <div className="w-20 bg-gray-200 relative h-40">
                  <div
                    className="absolute w-full bg-blue-200"
                    style={{
                      top: `${100 - Math.max(...dataset) * 20}%`,
                      height: `${(Math.max(...dataset) - Math.min(...dataset)) * 20}%`,
                    }}
                  />
                  <div
                    className="absolute w-full h-1 bg-blue-500"
                    style={{
                      top: `${100 - dataset[2] * 20}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case "word_cloud":
        return <TagCloud words={data.values as { text: string; value: number }[]} />;

      case "keyword_table":
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  {data.labels.map((label, i) => (
                    <th key={i} className="px-4 py-2 bg-gray-100">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data.values as unknown as string[][]).map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="border px-4 py-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "image_distribution_chart":
        return (
          <div className="grid grid-cols-3 gap-4">
            {data.labels.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt={`Option ${index + 1}`} className="w-full h-32 object-cover rounded" />
                <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white px-2 py-1 rounded-tl">
                  {(data.values as number[])[index]}%
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return <p className="text-gray-500">지원되지 않는 시각화 유형입니다.</p>;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      {/* 요약 통계 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-100 p-4 rounded-md">
          <h3 className="text-xs text-gray-500 mb-1">총 응답자 수</h3>
          <p className="text-2xl font-semibold text-gray-900 mb-1">{summary.totalResponses}</p>
          <div className="text-xs text-green-600 flex items-center">
            <span>↑</span>
            <span className="ml-0.5">12 증가</span>
          </div>
        </div>
        <div className="bg-white border border-gray-100 p-4 rounded-md">
          <h3 className="text-xs text-gray-500 mb-1">평균 만족도</h3>
          <p className="text-2xl font-semibold text-gray-900 mb-1">{summary.averageSatisfaction.current}/5</p>
          <div className="text-xs text-green-600 flex items-center">
            <span>↑</span>
            <span className="ml-0.5">0.3 상승</span>
          </div>
        </div>
        <div className="bg-white border border-gray-100 p-4 rounded-md">
          <h3 className="text-xs text-gray-500 mb-1">완료율</h3>
          <p className="text-2xl font-semibold text-gray-900 mb-1">{summary.completionRate.current}%</p>
          <div className="text-xs text-red-500 flex items-center">
            <span>↓</span>
            <span className="ml-0.5">2% 감소</span>
          </div>
        </div>
        <div className="bg-white border border-gray-100 p-4 rounded-md">
          <h3 className="text-xs text-gray-500 mb-1">평균 응답 시간</h3>
          <p className="text-2xl font-semibold text-gray-900 mb-1">{summary.averageTime.current}분</p>
          <div className="text-xs text-gray-500 flex items-center">
            <span>←</span>
            <span className="ml-0.5">변화없음</span>
          </div>
        </div>
      </div>

      {/* 차트 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {results.map((result, index) => (
          <div key={index} className="bg-white border border-gray-100 rounded-md">
            <div className="p-4 border-b border-gray-50">
              <h2 className="text-sm font-medium text-gray-900">{result.question}</h2>
              <p className="mt-1 text-xs text-gray-500">{getChartDescription(result.visualization_tag)}</p>
            </div>
            <div className="p-4">{renderChart(result)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 차트 타입별 설명 반환
function getChartDescription(type: string): string {
  const descriptions: Record<string, string> = {
    bar_chart: "응답 분포를 막대 그래프로 표시",
    pie_chart: "응답 비율을 원형 차트로 표시",
    line_graph: "시간에 따른 변화 추이",
    scatter_plot: "데이터 포인트의 분포",
    radar_chart: "다중 항목 평가 결과",
    stacked_bar_chart: "누적 데이터 비교",
    histogram: "구간별 빈도 분포",
    box_plot: "데이터의 분포와 이상치",
    word_cloud: "주요 키워드 시각화",
    keyword_table: "키워드 분석 결과",
    image_distribution_chart: "이미지 선호도 분석",
  };
  return descriptions[type] || "데이터 시각화";
}

// 더미 데이터
const dummyData: SurveyResult[] = [
  {
    question: "서비스에 얼마나 만족하셨습니까?",
    visualization_tag: "bar_chart",
    data: {
      labels: ["매우 만족", "만족", "보통", "불만족", "매우 불만족"],
      values: [50, 30, 15, 3, 2],
    },
  },
  {
    question: "가장 선호하는 제품 카테고리는 무엇입니까?",
    visualization_tag: "pie_chart",
    data: {
      labels: ["전자제품", "의류", "가구", "스포츠 용품"],
      values: [40, 30, 20, 10],
    },
  },
  {
    question: "SNS 사용 빈도는 얼마나 됩니까?",
    visualization_tag: "line_graph",
    data: {
      labels: ["매일", "가끔", "거의 안 함", "절대 안 함"],
      values: [60, 25, 10, 5],
    },
  },
  {
    question: "아래 항목을 중요도 순으로 정렬하세요.",
    visualization_tag: "scatter_plot",
    data: {
      labels: ["가격", "품질", "디자인", "브랜드"],
      values: [5, 8, 6, 7],
    },
  },
  {
    question: "서비스를 이용한 후의 감정을 선택하세요.",
    visualization_tag: "radar_chart",
    data: {
      labels: ["행복", "불만족", "중립", "흥미"],
      values: [70, 10, 15, 5],
    },
  },
  {
    question: "분기별 제품 카테고리 매출",
    visualization_tag: "stacked_bar_chart",
    data: {
      labels: ["1분기", "2분기", "3분기", "4분기"],
      values: [
        [100, 120, 150, 180], // 전자제품
        [80, 90, 110, 130], // 의류
        [50, 60, 70, 80], // 가구
      ],
    },
  },
  {
    question: "연령대별 사용자 분포",
    visualization_tag: "histogram",
    data: {
      labels: ["10대", "20대", "30대", "40대", "50대", "60대 이상"],
      values: [10, 35, 45, 30, 20, 10],
    },
  },
  {
    question: "제품별 평점 분포",
    visualization_tag: "box_plot",
    data: {
      labels: ["제품A", "제품B", "제품C"],
      values: [
        [3.5, 4.0, 4.5, 5.0, 4.2], // 제품A 평점
        [3.0, 3.8, 4.2, 4.8, 4.0], // 제품B 평점
        [3.2, 3.9, 4.3, 4.9, 4.1], // 제품C 평점
      ],
    },
  },
  {
    question: "자주 언급된 키워드",
    visualization_tag: "word_cloud",
    data: {
      labels: [],
      values: [
        { text: "품질", value: 85 },
        { text: "가격", value: 72 },
        { text: "디자인", value: 65 },
        { text: "서비스", value: 58 },
        { text: "배송", value: 45 },
        { text: "친절", value: 42 },
        { text: "편리함", value: 38 },
        { text: "AS", value: 35 },
      ],
    },
  },
  {
    question: "주요 키워드 분석",
    visualization_tag: "keyword_table",
    data: {
      labels: ["키워드", "언급 횟수", "긍정도"],
      values: [
        ["품질", "85회", "92%"],
        ["가격", "72회", "85%"],
        ["디자인", "65회", "88%"],
        ["서비스", "58회", "90%"],
        ["배송", "45회", "95%"],
      ],
    },
  },
  {
    question: "선호하는 제품 디자인",
    visualization_tag: "image_distribution_chart",
    data: {
      labels: ["/images/design1.jpg", "/images/design2.jpg", "/images/design3.jpg"],
      values: [45, 35, 20],
    },
  },
];
