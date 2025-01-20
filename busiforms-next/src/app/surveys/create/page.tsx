"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container, Grid, GridItem, Input } from "@chakra-ui/react";
import axios from "axios";
import ChatbotChat from "@/components/surveys/create/ChatbotChat";
import Button from "@/components/common/Button/Button";
import { Toaster, toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import { FaCheckCircle, FaList, FaTextHeight, FaCalendarAlt, FaClock, FaHashtag, FaChartBar, FaChartPie, FaChartLine, FaTimes } from "react-icons/fa";
import LoadingSpinner from "@/components/common/LoadingSpinner";

import { useSession } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

interface SurveyResponse {
  questions: {
    text: string;
    questionType: string;
    options?: string[];
    visualizationType?: string;
  }[];
}

const CreateSurveyPage = () => {
  const [surveyData, setSurveyData] = useState<Survey | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";
  const surveyId = searchParams.get("id");
  const [isChatbotLoading, setIsChatbotLoading] = useState(false);
  const [price, setPrice] = useState<string>("0");

  const router = useRouter();

  const { data: session } = useSession();
  const userId = session?.user?.id as string;

  useEffect(() => {
    if (isEdit && surveyId) {
      const title = searchParams.get("title") || "";
      const description = searchParams.get("description") || "";
      setTitle(title);
      setDescription(description);
      // Fetch the survey data if needed
      axios.get(`http://localhost:3001/api/surveys/${surveyId}`).then((response) => {
        // when fetched, remove the 'id, userId, title, description, createdAt, updatedAt' fields from the response
        // Also remove 'visualizationType, surveyId, createdAt' from each question
        const newSurveyData = response.data;
        newSurveyData.questions = response.data.questions.map(
          (question: {
            id?: string;
            userId?: string;
            title?: string;
            description?: string;
            createdAt?: string;
            updatedAt?: string;

            options: { id?: string; createdAt?: string; updatedAt?: string }[];
          }) => {
            delete question.id;
            delete question.userId;
            delete question.title;
            delete question.description;
            delete question.createdAt;
            delete question.updatedAt;
            question.options = question.options.map((option: { id?: string; createdAt?: string; updatedAt?: string }) => {
              delete option.id;
              delete option.createdAt;
              delete option.updatedAt;
              return option;
            });
            return question;
          }
        );
        setSurveyData(newSurveyData);
      });
    }
  }, [isEdit, surveyId, searchParams]);

  async function createSurveyButtonClicked(): Promise<void> {
    if (!userId || !surveyData || !title || !description) {
      toaster.create({
        title: "설문 데이터가 없습니다.",
        description: "설문 제목과 설명을 입력해주세요.",
        duration: 3000,
      });
      return;
    }

    try {
      console.log("price is", price);
      const response = isEdit
        ? await axios.put(`http://localhost:3001/api/surveys/${surveyId}`, {
            ...surveyData,
            title,
            description,
            price: Number(price),
            userId: userId,
          })
        : await axios.post("http://localhost:3001/api/surveys", {
            ...surveyData,
            userId: userId,
            title,
            price: Number(price),
            description,
          });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to create survey");
      }
      toaster.create({
        title: isEdit ? "설문이 성공적으로 수정되었습니다." : "설문이 성공적으로 생성되었습니다.",
        description: isEdit ? "설문 수정 완료" : "설문 생성 완료",
        duration: 3000,
      });

      // 1초 뒤, /dashboard 페이지로 이동
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      toaster.create({
        title: isEdit ? "설문 수정 실패" : "설문 생성 실패",
        description: "서버 오류가 발생했습니다." + error,
        duration: 3000,
      });
    }
  }

  return (
    <div className={`relative min-h-screen pb-40 bg-gray-100 ${inter.className}`}>
      <Toaster />
      <Container pt={6}>
        <div className="bg-white p-3 rounded-lg">
          <Grid templateColumns="repeat(9, 1fr)" gap={4} alignItems="center">
            <GridItem colSpan={3}>
              <label className="block">
                <span className="text-gray-700">설문지 제목</span>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="설문 제목을 입력하세요"
                  size="md"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-inter"
                  _hover={{ borderColor: "gray.300" }}
                  _focus={{ boxShadow: "none" }}
                />
              </label>
            </GridItem>
            <GridItem colSpan={3}>
              <label className="block">
                <span className="text-gray-700">설명</span>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="설문 설명을 입력하세요"
                  size="md"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-inter"
                  _hover={{ borderColor: "gray.300" }}
                  _focus={{ boxShadow: "none" }}
                />
              </label>
            </GridItem>
            <GridItem colSpan={3}>
              <label className="block">
                <span className="text-gray-700">가격 (정산이 없으면 0원 입력)</span>
                <Input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="가격을 입력하세요"
                  size="md"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-inter"
                  _hover={{ borderColor: "gray.300" }}
                  _focus={{ boxShadow: "none" }}
                />
              </label>
            </GridItem>
          </Grid>
        </div>
      </Container>
      <Container>
        <Grid
          templateColumns="repeat(5, 1fr)"
          gap={3}
          pt={6}
          height={"100%"}
          className={`transition-all duration-700 ${isChatbotLoading ? "blur" : ""}`}
          style={{ filter: isChatbotLoading ? "blur(2px)" : "none" }}
        >
          <GridItem colSpan={3} position="relative">
            <div className="bg-white p-3 rounded-lg">
              <h1 className="text-xl font-bold font-inter">실시간 미리보기</h1>
              <div className="mt-3 p-3 bg-gray-100 rounded overflow-auto relative" style={{ height: "calc(70vh)" }}>
                {surveyData ? (
                  <PreviewSurveyForm survey={surveyData} />
                ) : (
                  <p className="text-gray-500 font-inter">설문 데이터가 여기에 표시됩니다.</p>
                )}
              </div>
              {isChatbotLoading && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ height: "calc(70vh)" }}>
                  <LoadingSpinner />
                </div>
              )}
            </div>
          </GridItem>
          <GridItem colSpan={2}>
            <div className="bg-white p-3 rounded-lg" style={{ height: "calc(70vh)" }}>
              <h1 className="text-xl font-bold font-inter">Create Survey</h1>
              <ChatbotChat
                givenPoll={surveyData || undefined}
                onSurveyUpdate={(data: SurveyResponse) => {
                  const formattedData: Survey = {
                    questions: data.questions.map((question) => ({
                      ...question,
                      options: question.options || [],
                      visualizationType: question.visualizationType || "",
                    })),
                  };
                  setSurveyData(formattedData);
                }}
                onLoadingChange={setIsChatbotLoading}
              />
            </div>
          </GridItem>
        </Grid>
      </Container>
      <Grid templateColumns="repeat(5, 1fr)" gap={3} className="fixed bottom-0 left-0 right-0 bg-[#f1f1f1] p-2">
        <GridItem colSpan={3}>
          <div className="justify-center">
            <p className="text-gray-700 text-sm font-inter">생성자 id: {userId ? userId : "Loading..."}</p>
          </div>
        </GridItem>
        <GridItem colSpan={2}>
          <div className="flex justify-center">
            <Button
              onClick={() => createSurveyButtonClicked()}
              className="font-inter bg-[#3953D5] hover:bg-[#3953D5]/90 text-white px-6 py-2 rounded-lg transition-all duration-200"
            >
              {isEdit ? "설문지 수정하기!" : "설문지 업로드하기!"}
            </Button>
          </div>
        </GridItem>
      </Grid>
    </div>
  );
};

interface Survey {
  questions: {
    visualizationType: string;
    text: string;
    questionType: string;
    options: string[];
  }[];
}

const PreviewSurveyForm: React.FC<{ survey: Survey }> = ({ survey }) => {
  const questionTypeMap: { [key: string]: { label: string; icon: JSX.Element } } = {
    radio: { label: "1개 선택", icon: <FaCheckCircle /> },
    checkbox: { label: "여러 개 선택", icon: <FaCheckCircle /> },
    dropdown: { label: "드롭다운", icon: <FaList /> },
    text: { label: "텍스트", icon: <FaTextHeight /> },
    number: { label: "숫자", icon: <FaHashtag /> },
    date: { label: "날짜", icon: <FaCalendarAlt /> },
    time: { label: "시간", icon: <FaClock /> },
    datetime: { label: "날짜 및 시간", icon: <FaCalendarAlt /> },
    long_text: { label: "긴 텍스트", icon: <FaTextHeight /> },
  };

  const visualizationTypeMap: { [key: string]: { label: string; icon: JSX.Element } } = {
    bar_chart: { label: "막대 그래프", icon: <FaChartBar /> },
    pie_chart: { label: "원형 그래프", icon: <FaChartPie /> },
    line_chart: { label: "선형 그래프", icon: <FaChartLine /> },
    histogram: { label: "히스토그램", icon: <FaChartBar /> },
    scatter_plot: { label: "산점도", icon: <FaChartLine /> },
    box_plot: { label: "박스 플롯", icon: <FaChartBar /> },
    text_only: { label: "텍스트만", icon: <FaTextHeight /> },
    word_cloud: { label: "키워드", icon: <FaHashtag /> },
  };

  const getVisualizationLabel = (type: string | null) => {
    if (type === null) return null;
    if (type === "none") return { icon: <FaTimes />, label: "시각화 불가" };
    return visualizationTypeMap[type] || { icon: <FaChartBar />, label: type };
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto overflow-auto font-inter">
      {survey.questions.map(
        (
          question: {
            visualizationType: string;
            text: string;
            questionType: string;
            options: string[];
          },
          index: number
        ) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-md font-semibold text-gray-800">{question.text}</h3>
              <div className="flex items-center space-x-2">
                {/* Question Type Badge */}
                <span className="flex items-center px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                  {questionTypeMap[question.questionType]?.icon}
                  <span className="ml-1">{questionTypeMap[question.questionType]?.label || question.questionType}</span>
                </span>

                {/* Visualization Type Badge */}
                {question.visualizationType === "" ? (
                  <span className="flex items-center gap-2 px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                    <span className="loading loading-spinner loading-xs"></span>
                    추론 중...
                  </span>
                ) : question.visualizationType === "none" ? (
                  <span className="flex items-center px-2 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                    <FaTimes />
                    <span className="ml-1">시각화 불가</span>
                  </span>
                ) : (
                  <span className="flex items-center px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                    {getVisualizationLabel(question.visualizationType)?.icon}
                    <span className="ml-1">{getVisualizationLabel(question.visualizationType)?.label}</span>
                  </span>
                )}
              </div>
            </div>

            {question.options.length > 0 && (
              <div className="mt-2">
                <ul className="grid gap-1">
                  {question.options.map((option: string, idx: number) => (
                    <li key={idx} className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
                      <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                      <span>{option}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default CreateSurveyPage;
