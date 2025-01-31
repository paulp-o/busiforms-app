import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import axios from "axios";

import { useRouter } from "next/navigation";
import { Button } from "@chakra-ui/react";

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
  price: number;
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

const FormViewer: React.FC<{ form: Form }> = ({ form }) => {
  const router = useRouter();
  const validationSchema = createValidationSchema(form.questions);
  const [isPaid, setIsPaid] = useState(form.price === 0);

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
        formId: form.id,
        answers: data,
      });
      console.log("Response from server:", response.data);
      // Redirect to completion page
      router.push(`/forms/${form.id}/complete`);
    } catch (error) {
      console.error("Error submitting data:", error);
      // You might want to show an error message to the user here
    }
  };

  const handlePayment = () => {
    // Simulate a payment process
    const paymentSuccessful = window.confirm("결제를 진행하시겠습니까?");
    if (paymentSuccessful) {
      setIsPaid(true);
      alert("결제가 완료되었습니다.");
    } else {
      alert("결제가 실패했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {form.questions.map((question) => (
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
                case "long_text":
                  return <textarea {...field} className="border rounded-md p-2 w-full" />;
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
      {form.price > 0 && !isPaid && (
        <>
          <p className="text-red-500">이 설문조사는 {form.price}원을 결제해야 제출할 수 있습니다!</p>
          <div className="flex justify-center">
            <Button
              type="button"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full max-w-md"
              onClick={handlePayment}
              variant="solid"
            >
              결제하기
            </Button>
          </div>
        </>
      )}
      <div className="flex justify-center">
        <Button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full max-w-md"
          onSubmit={handleSubmit(onSubmit)}
          disabled={!isPaid && form.price > 0}
        >
          제출하기!
        </Button>
      </div>
    </form>
  );
};

export default FormViewer;
