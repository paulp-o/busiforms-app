import prisma from "../../../../prisma/context";

export async function POST(request: Request) {
  const body = await request.json();

  // console.log(body.toString());
  const surveyData = body.surveyData;

  const title = surveyData.title;
  const description = surveyData.description || "";
  const theme: string = surveyData.theme;
  const questions = surveyData.questions;

  // save the survey to the database
  const createdSurvey = await prisma.survey.create({
    data: {
      title,
      description,
      theme,
      questions: { create: questions },
      responses: {
        create: [],
      },
    },
  });
  const createdSurveyId = createdSurvey.id;

  // respond with a json
  return new Response(
    JSON.stringify({
      surveyId: createdSurveyId,
    }),
    {
      headers: { "content-type": "application/json" },
    }
  );
}
