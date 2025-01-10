import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class SurveyAiLoopService {
  async generatePoll(userInput?: string, givenPoll?: string) {
    // OpenAI에 보낼 ChatCompletion
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const response = await openai.beta.chat.completions.parse({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: [
            {
              text: `
              Build a JSON about the list of questions for a poll, based on the user input. You need to build, edit, or delete some questions to follow the user's needs.
              
              # Output Format
              
              The output should be formatted as a JSON object, consisting of an array of questions. Each question should be represented as an object with the keys \`type\`, \`text\`, and (if necessary) \`options\`. Do not wrap the JSON in code blocks. You might be asked with the earlier version of the poll. Then, follow the user's request to modify the given poll. Example:
              
              \`\`\`json
              [
                {
                  "questionType": "text",
                  "text": "이름을 알려주세요"
                },
                {
                  "questionType": "radio",
                  "text": "성별을 알려주세요"
                  "options": [
                    "여성",
                    "남성"
                  ]
                },
                {
                  "questionType": "number",
                  "text": "나이를 알려주세요"
                },
                {
                  "questionType": "long_text",
                  "text": "취미를 설명해주세요"
                }
              ]
              \`\`\`
              
              ${givenPoll ? `Earlier Poll: ${givenPoll}` : ''}

              ### Important
              - Try to preserve the original survey's content if given.
              - If the given survey has ids, you should strictly preserve them. However, you shouldn't add ids to newly generated questions.

              `,
              type: 'text',
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              text: `User Input: ${userInput || ''}\n${givenPoll ? `Given Poll: ${givenPoll}` : ''}`,
              type: 'text',
            },
          ],
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'poll_questions',
          strict: false,
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              questions: {
                type: 'array',
                additionalProperties: false,
                items: {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    questionType: {
                      type: 'string',
                      additionalProperties: false,
                      enum: [
                        'radio',
                        'checkbox',
                        'dropdown',
                        'text',
                        'number',
                        'date',
                        'time',
                        'datetime',
                        'none',
                      ],
                    },
                    text: {
                      type: 'string',
                      additionalProperties: false,
                    },
                    options: {
                      type: 'array',
                      additionalProperties: false,
                      items: {
                        type: 'string',
                        additionalProperties: false,
                      },
                    },
                    id: {
                      type: 'string',
                      additionalProperties: false,
                    },
                  },
                  required: ['questionType', 'text'],
                },
              },
            },
            required: ['questions'],
          },
        },
      },
      temperature: 1,
      max_completion_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // it's already parsed
    const answer = response.choices[0].message.parsed;

    return answer;
  }

  async inferVisualizationType(question: string) {
    // OpenAI에 보낼 ChatCompletion
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const response = await openai.beta.chat.completions.parse({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: [
            {
              text: `
              You are a data analyst. You are given a survey question and need to decide what type of visualization is suitable for the given question. choces are: bar_chart, pie_chart, histogram, word_cloud.
              
              # Output Format
              
              The output should be formatted as a JSON object, consisting of a single key \`visualizationType\`. Do not wrap the JSON in code blocks. Example:
              
              \`\`\`json
              {
                "visualizationType": "bar_chart"
              }
              \`\`\`
              - You MUST generate 'none' if no visualization is suitable.
              `,
              type: 'text',
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              text: `Question: ${question}`,
              type: 'text',
            },
          ],
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'poll_questions',
          strict: false,
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              visualizationType: {
                type: 'string',
                additionalProperties: false,
                enum: [
                  'bar_chart',
                  'pie_chart',
                  'histogram',
                  'word_cloud',
                  'none',
                ],
              },
            },
          },
        },
      },
      temperature: 1,
      max_completion_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // it's already parsed
    const answer = response.choices[0].message.parsed;

    return answer;
  }
}
