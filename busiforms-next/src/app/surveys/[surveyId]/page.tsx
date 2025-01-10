"use client";

import React, { useEffect, useState } from "react";
// import { Spinner } from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "next/navigation";
import SurveyForm from "@/components/SurveyForm"; // Import the SurveyForm component

// TypeScript Interfaces
type QuestionType = "text" | "radio" | "number" | "checkbox" | "dropdown" | "date" | "time" | "datetime";

interface Question {
  id: string;
  text: string;
  questionType: QuestionType;
  options?: string[];
}

interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

// Fetch Survey Data from Server
const fetchSurvey = async (surveyId: string): Promise<Survey> => {
  const response = await axios.get(`http://localhost:3001/api/surveys/${surveyId}`);
  return response.data;
};

const SurveyPage: React.FC = () => {
  const { surveyId } = useParams() as { surveyId: string };

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!surveyId) {
      setLoading(false);
      return;
    }

    const loadSurvey = async () => {
      try {
        const data = await fetchSurvey(surveyId);
        setSurvey(data);
      } catch (error) {
        console.error("Error fetching survey:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSurvey();
  }, [surveyId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error loading survey</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-4">{survey.title}</h1>
      <p className="text-gray-700 mb-6">{survey.description}</p>
      <SurveyForm survey={survey} />
    </div>
  );
};

export default SurveyPage;
