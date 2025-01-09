"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/layout/Header/Header";
import { useAuth } from "@/hooks/useAuth";
import { Flex, VStack, Box, Heading, Grid, GridItem, Spinner } from "@chakra-ui/react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      // 로그인이 안 된 상태임
      router.push("/auth/login");
    } else if (user) {
      // Fetch surveys for the logged-in user
      axios.get(`http://localhost:3001/api/surveys/by-user/` + user.id).then((response) => {
        console.log(response.data);
        setSurveys(response.data);
      });
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* 메인 콘텐츠 */}
      <Dashboard user={user} surveys={surveys} />
    </div>
  );
}

interface DashboardProps {
  user: {
    email: string;
    id: string;
    username: string;
  };
  surveys: {
    id: string;
    title: string;
    description: string;
    createdAt: string;
  }[];
}

const Dashboard: React.FC<{
  user: DashboardProps["user"];
  surveys: DashboardProps["surveys"];
}> = ({ user, surveys }) => {
  const router = useRouter();
  const [surveyList, setSurveyList] = useState(surveys);

  useEffect(() => {
    setSurveyList(surveys);
  }, [surveys]);

  return (
    //  left aside
    <Flex height="100vh">
      {/* 좌측 패널 */}
      <Box w="300px" bg="gray.800" color="white" p={5} display="flex" flexDirection="column" justifyContent="space-between">
        <VStack align="center" gap={4}>
          {/* 프로필 이미지 및 정보 */}
          {user.username} 님
        </VStack>
      </Box>
      {/* 메인 콘텐츠 */}
      {/* 우측 패널 */}
      <Box flex="1" p={8} bg="gray.100">
        {/* 나의 설문지 제목 */}
        <Heading size="lg" mb={6}>
          {" "}
          나의 설문지{" "}
        </Heading>
        {/* 나의 설문지 목록: 가로 3개 grid */}
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          {/* 설문지 카드들 */}
          <GridItem>
            <Box
              bg="blue.500"
              color="white"
              height="100%"
              p={6}
              rounded="lg"
              shadow="md"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              onClick={() => router.push("/surveys/create")}
            >
              <Heading size="md" mb={2}>
                새 설문지 만들기
              </Heading>
            </Box>
          </GridItem>
          {surveyList.map((survey) => (
            <GridItem key={survey.id}>
              <Box bg="white" p={6} rounded="lg" shadow="md" display="flex" height={"100%"} flexDirection="column" justifyContent="space-between">
                <Heading size="md" mb={2}>
                  {survey.title}
                </Heading>
                <Box mb={4} fontSize="x-small">
                  {survey.description}
                </Box>
                <Box fontSize="sm" color="gray.500">
                  {new Date(survey.createdAt).toLocaleDateString()}
                </Box>
                <Box fontFamily="monospace" fontSize="xx-small" mb={4}>
                  {survey.id}
                </Box>
                <Flex direction="column" gap={2}>
                  <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                    <Box
                      as="button"
                      bg="blue.500"
                      color="white"
                      p={1}
                      rounded="md"
                      fontSize="xs"
                      onClick={() => router.push(`/surveys/${survey.id}`)}
                    >
                      설문조사 참가 링크
                    </Box>
                    <Box
                      as="button"
                      bg="gray.500"
                      color="white"
                      p={1}
                      rounded="md"
                      fontSize="xs"
                      onClick={() => navigator.clipboard.writeText(`${window.location.origin}/surveys/${survey.id}`)}
                    >
                      복사하기
                    </Box>
                    <Box
                      as="button"
                      bg="green.500"
                      color="white"
                      p={1}
                      rounded="md"
                      fontSize="xs"
                      onClick={() =>
                        router.push(
                          `/surveys/create?edit=true&id=${survey.id}&title=${encodeURIComponent(survey.title)}&description=${encodeURIComponent(
                            survey.description
                          )}`
                        )
                      }
                    >
                      설문조사 수정하기
                    </Box>
                    <Box
                      as="button"
                      bg="red.500"
                      color="white"
                      p={1}
                      rounded="md"
                      fontSize="xs"
                      onClick={() => {
                        if (confirm("정말로 삭제하시겠습니까?")) {
                          axios.delete(`http://localhost:3001/api/surveys/${survey.id}`).then(() => {
                            setSurveyList(surveyList.filter((s) => s.id !== survey.id));
                          });
                        }
                      }}
                    >
                      설문조사 삭제하기
                    </Box>
                  </Grid>
                </Flex>
              </Box>
            </GridItem>
          ))}
        </Grid>
      </Box>
    </Flex>
  );
};
