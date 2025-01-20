export const getSurveysQueryKey = (userId: string) => ["surveys", userId];

export const fetchSurveys = async (userId: string) => {
  console.log("fetching surveys:", userId);

  // simulate 1 second delay
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await fetch(`http://localhost:3001/api/surveys/by-user/${userId}`);
  if (!response.ok) throw new Error("Failed to fetch surveys");
  // console.log("fetched surveys:", userId);
  return response.json();
};
