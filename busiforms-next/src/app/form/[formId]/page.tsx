"use client";

import React, { useEffect, useState } from "react";
// import { Spinner } from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "next/navigation";
import FormViewer from "@/components/form/FormViewer"; // Import the FormViewer component

// TypeScript Interfaces
type QuestionType = "text" | "radio" | "number" | "checkbox" | "dropdown" | "date" | "time" | "datetime" | "long_text";

interface Question {
  id: string;
  text: string;
  questionType: QuestionType;
  options?: string[];
}

interface Form {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  price: number;
}

// Fetch Form Data from Server
const fetchForm = async (formId: string): Promise<Form> => {
  const response = await axios.get(`http://localhost:3001/api/forms/${formId}`);
  return response.data;
};

const FormPage: React.FC = () => {
  const { formId } = useParams() as { formId: string };

  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!formId) {
      setLoading(false);
      return;
    }

    const loadForm = async () => {
      try {
        const data = await fetchForm(formId);
        setForm(data);
      } catch (error) {
        console.error("Error fetching form:", error);
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [formId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error loading form</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-4">{form.title}</h1>
      <p className="text-gray-700 mb-6">{form.description}</p>
      <FormViewer form={form} />
    </div>
  );
};

export default FormPage;
