import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "./common/Button/Button";
import axios from "axios";

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

// Zod Validation Schema Creation
const createValidationSchema = (questions: Question[]) => {
  const schemaObject: Record<string, z.ZodTypeAny> = {};

  questions.forEach((question) => {
    switch (question.questionType) {
      case "text":
        schemaObject[question.id] = z.string().min(1, "This field is required");
        break;
      case "radio":
      case "dropdown":
        schemaObject[question.id] = z.string().min(1, "Please select an option");
        break;
      case "checkbox":
        schemaObject[question.id] = z.array(z.string()).min(1, "Please select at least one option");
        break;
      case "number":
        schemaObject[question.id] = z.coerce.number({ invalid_type_error: "Please enter a valid number" }).min(1, "Number must be greater than 0");
        break;
      case "date":
      case "time":
      case "datetime":
        schemaObject[question.id] = z.string().min(1, "This field is required");
        break;
    }
  });

  return z.object(schemaObject);
};

const SurveyForm: React.FC<{ survey: Survey }> = ({ survey }) => {
  const validationSchema = createValidationSchema(survey.questions);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
  });
  const onSubmit = async (data: Record<string, z.ZodTypeAny>) => {
    try {
      const response = await axios.post("http://localhost:3001/api/responses", {
        surveyId: survey.id,
        answers: data,
      });
      console.log("Response from server:", response.data);
    } catch (error) {
      console.error("Error submitting data:", error);
    }

    console.log("Submitted Data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {survey.questions.map((question) => (
        <div key={question.id} className="flex flex-col space-y-2">
          <label className="font-medium text-gray-900">{question.text}</label>
          <Controller
            name={question.id}
            control={control}
            defaultValue={question.questionType === "checkbox" ? [] : ""}
            render={({ field }) => {
              switch (question.questionType) {
                case "text":
                  return <input {...field} type="text" className="border rounded-md p-2 w-full" />;
                case "date":
                  return <input {...field} type="date" className="border rounded-md p-2 w-full" />;
                case "time":
                  return <input {...field} type="time" className="border rounded-md p-2 w-full" />;
                case "datetime":
                  return <input {...field} type="datetime-local" className="border rounded-md p-2 w-full" />;
                case "number":
                  return (
                    <input
                      {...field}
                      type="number"
                      onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                      className="border rounded-md p-2 w-full"
                    />
                  );
                case "radio":
                  return (
                    <div className="flex space-x-4">
                      {question.options?.map((option) => (
                        <label key={option} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value={option}
                            checked={field.value === option}
                            onChange={() => field.onChange(option)}
                            className="form-radio"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  );
                case "dropdown":
                  return (
                    <select {...field} className="border rounded-md p-2 w-full">
                      <option value="" disabled>
                        옵션을 선택하세요
                      </option>
                      {question.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  );
                case "checkbox":
                  return (
                    <div className="flex flex-col space-y-2">
                      {question.options?.map((option) => (
                        <label key={option} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            value={option}
                            checked={field.value.includes(option)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...field.value, option]);
                              } else {
                                field.onChange(field.value.filter((val: string) => val !== option));
                              }
                            }}
                            className="form-checkbox"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  );
                default:
                  return <div>Unsupported question type</div>;
              }
            }}
          />
          {errors[question.id] && <span className="text-red-500 text-sm">{errors[question.id]?.message?.toString()}</span>}
        </div>
      ))}
      <Button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
        제출하기!
      </Button>
    </form>
  );
};

export default SurveyForm;
