import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: Request) {
  // Extract user input from the request
  const userInput = new URL(request.url).searchParams.get("input");
  const givenPoll = new URL(request.url).searchParams.get("givenPoll");

  // Call OpenAI API to generate questions based on user input
  const response = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: [
          {
            text: `
            Build a JSON about the list of questions for a poll, based on the user input. You need to build, edit, or delete some questions to follow the user's needs.
            
            # Output Format
            
            The output should be formatted as a JSON object, consisting of an array of questions. Each question should be represented as an object with the keys \`type\`, \`text\`, and (if necessary) \`options\`. Do not wrap the JSON in code blocks. You might be asked with the earlier version of the poll. Then, follow the user's request to modify the given poll. Example:
            
            \`\`\`json
            [
              {
                "type": "input",
                "text": "이름을 알려주세요"
              },
              {
                "type": "choice",
                "text": "성별을 알려주세요",
                "options": [
                  "여성",
                  "남성"
                ]
              },
              {
                "type": "input",
                "text": "나이를 알려주세요"
              },
              {
                "type": "multiple-choice",
                "text": "취미를 알려주세요",
                "options": [
                  "운동",
                  "독서",
                  "음악감상",
                  "요리"
                ]
              }
            ]
            \`\`\`
            
            ${givenPoll ? `Earlier Poll: ${givenPoll}` : ""}
            `,
            type: "text",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            text: `User Input: ${userInput || ""}\n${givenPoll ? `Given Poll: ${givenPoll}` : ""}`,
            type: "text",
          },
        ],
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "poll_questions",
        strict: false,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            questions: {
              type: "array",
              additionalProperties: false,
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  format: {
                    type: "string",
                    additionalProperties: false,
                    enum: ["input", "choice", "multiple-choice"],
                  },
                  text: {
                    type: "string",
                    additionalProperties: false,
                  },
                  options: {
                    type: "array",
                    additionalProperties: false,
                    items: {
                      type: "string",
                      additionalProperties: false,
                    },
                  },
                },
                required: ["format", "text"],
              },
            },
          },
          required: ["questions"],
        },
      },
    },
    temperature: 1,
    max_completion_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  // Return the generated questions as JSON response
  return NextResponse.json(response.choices[0].message.parsed);
}
