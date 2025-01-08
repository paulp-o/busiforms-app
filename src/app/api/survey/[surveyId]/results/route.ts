import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { surveyId: string } }
) {
  try {
    const dummyResults = [
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
        question: "월별 서비스 이용 횟수",
        visualization_tag: "line_graph",
        data: {
          labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
          values: [10, 15, 13, 25, 22, 30],
        },
      },
      {
        question: "연령대별 만족도 분포",
        visualization_tag: "scatter_plot",
        data: {
          labels: ["20대", "30대", "40대", "50대", "60대"],
          values: [85, 75, 88, 92, 70],
        },
      },
      {
        question: "서비스 품질 평가",
        visualization_tag: "radar_chart",
        data: {
          labels: ["사용성", "디자인", "성능", "가격", "고객지원"],
          values: [4.5, 4.2, 4.8, 3.9, 4.6],
        },
      },
      {
        question: "일별 접속자 수 히트맵",
        visualization_tag: "heatmap",
        data: {
          labels: ["월", "화", "수", "목", "금"],
          values: [
            [10, 20, 30, 25, 15],
            [15, 25, 35, 30, 20],
            [20, 30, 40, 35, 25],
          ],
        },
      },
      {
        question: "자주 언급된 키워드",
        visualization_tag: "word_cloud",
        data: {
          labels: [],
          values: [
            { text: "편리함", value: 64 },
            { text: "빠른배송", value: 50 },
            { text: "친절", value: 43 },
            { text: "품질", value: 38 },
            { text: "가격", value: 35 },
          ],
        },
      },
      {
        question: "월간 매출 추이",
        visualization_tag: "stacked_bar_chart",
        data: {
          labels: ["1월", "2월", "3월", "4월"],
          values: [
            [100, 120, 150, 170],  // 제품A
            [50, 60, 70, 80],      // 제품B
            [30, 40, 45, 50],      // 제품C
          ],
        },
      },
      {
        question: "고객 연령 분포",
        visualization_tag: "histogram",
        data: {
          labels: ["10-20", "21-30", "31-40", "41-50", "51-60", "61+"],
          values: [15, 30, 45, 35, 25, 10],
        },
      },
      {
        question: "제품별 평점 분포",
        visualization_tag: "box_plot",
        data: {
          labels: ["제품A", "제품B", "제품C"],
          values: [
            [3.5, 4.0, 4.5, 5.0, 4.2],  // 제품A 평점들
            [3.0, 3.8, 4.2, 4.8, 4.0],  // 제품B 평점들
            [3.2, 3.9, 4.3, 4.9, 4.1],  // 제품C 평점들
          ],
        },
      },
      {
        question: "월별 활성 사용자",
        visualization_tag: "calendar_heatmap",
        data: {
          labels: ["2024-01", "2024-02", "2024-03", "2024-04"],
          values: [150, 180, 220, 200],
        },
      },
      {
        question: "주요 키워드 분석",
        visualization_tag: "keyword_table",
        data: {
          labels: ["키워드", "언급횟수", "긍정도"],
          values: [
            ["품질", 150, "85%"],
            ["가격", 120, "75%"],
            ["배송", 100, "90%"],
            ["서비스", 80, "88%"],
          ],
        },
      },
      {
        question: "제품 이미지 선호도",
        visualization_tag: "image_distribution_chart",
        data: {
          labels: [
            "/images/product1.jpg",
            "/images/product2.jpg",
            "/images/product3.jpg"
          ],
          values: [45, 30, 25], // 각 이미지의 선호도 퍼센트
        },
      },
    ];

    return NextResponse.json(dummyResults);
  } catch (error) {
    console.error('Failed to fetch survey results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch survey results' },
      { status: 500 }
    );
  }
} 