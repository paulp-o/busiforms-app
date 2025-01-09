"use client";
import React, { useState } from "react";
import { Container, Grid, GridItem } from "@chakra-ui/react";
import axios from "axios";
import ChatbotChat from "@/components/surveys/create/ChatbotChat";
import Button from "@/components/common/Button/Button";
import { Toaster, toaster } from "@/components/ui/toaster";

const CreateSurveyPage: React.FC = () => {
  const [surveyData, setSurveyData] = useState<object | null>(null);

  async function createSurveyButtonClicked(): Promise<void> {
    if (!surveyData) {
      toaster.create({
        title: "설문 데이터가 없습니다.",
        description: "설문 데이터를 입력해주세요.",
        duration: 3000,
      });
      return;
    }

    try {
      // First, put 'visualizationType' to '

      const response = await axios.post("http://localhost:3001/api/surveys", {
        userId: "cm5p8th30000apjxsggl72voh", // TODO: Replace with actual user ID
        title: "사용자 만족도 조사",
        description: "사용자의 만족도를 조사하는 설문입니다.",

        ...surveyData,
      });

      toaster.create({
        title: "설문이 성공적으로 생성되었습니다.",
        // render out response body
        description: "설문 생성 완료" + JSON.stringify(response.data),
        duration: 3000,
      });

      // Optional: Redirect to surveys list or clear form
    } catch (error) {
      toaster.create({
        title: "설문 생성 실패",
        description: "서버 오류가 발생했습니다." + error,
        duration: 3000,
      });
    }
  }

  return (
    <div className="relative min-h-screen pb-40">
      <Toaster />
      {/* just show some dummy logo and username */}
      {/* TODO replace this navbar to layout  */}
      <nav className="flex items-center justify-between bg-gray-800 p-3">
        <div className="flex items-center space-x-4">
          {/* <img className="h-8 w-auto" src="/images/logo.png" alt="BusiForm" /> */}
          <span className="text-white">BusiForm</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-slate-700 p-2">
            <span className="text-white">Welcome, Paul Park</span>
          </button>
        </div>
      </nav>
      <Container pt={10}>{/* this card lets the user input the survey's title and description */}</Container>
      <Container>
        {/* grid based layout. horizontal 3:2. */}
        <Grid templateColumns="repeat(5, 1fr)" gap={4} pt={10}>
          <GridItem colSpan={3}>
            <div className="bg-white p-4">
              <h1 className="text-2xl font-bold">실시간 미리보기</h1>
              <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
                {surveyData ? JSON.stringify(surveyData, null, 2) : "설문 데이터가 여기에 표시됩니다."}
              </pre>
            </div>
          </GridItem>
          <GridItem colSpan={2}>
            <div className="bg-white p-4">
              <h1 className="text-2xl font-bold">Create Survey</h1>
              <ChatbotChat onSurveyUpdate={setSurveyData} />
            </div>
          </GridItem>
        </Grid>
      </Container>
      <Grid templateColumns="repeat(5, 1fr)" gap={4} className="fixed bottom-0 left-0 right-0 bg-gray-800 p-3">
        <GridItem colSpan={3}>{/* 좌측 하단 빈 공간 */}</GridItem>
        <GridItem colSpan={2}>
          <div className="flex justify-center">
            <Button onClick={() => createSurveyButtonClicked()}>설문지 업로드하기!</Button>
          </div>
        </GridItem>
      </Grid>
    </div>
  );
};

export default CreateSurveyPage;
