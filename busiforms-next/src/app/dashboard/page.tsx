"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/layout/Header/Header";
import { useAuth } from "@/hooks/useAuth";
import { Flex, VStack, Box, Heading, Grid, GridItem, Spinner, Text } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";

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
      <Toaster />
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
    price?: number;
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
      <Box
        w="300px"
        bg="gray.800"
        color="white"
        p={6}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        borderRight="1px"
        borderColor="gray.700"
      >
        <VStack align="stretch" gap={6}>
          <VStack align="center" gap={3}>
            <Box w="80px" h="80px" borderRadius="full" bg="blue.500" display="flex" alignItems="center" justifyContent="center" fontSize="2xl">
              {user.username[0].toUpperCase()}
            </Box>
            <Text fontSize="lg" fontWeight="bold">
              {user.username} 님
            </Text>
          </VStack>
          <VStack align="stretch" gap={2}>
            <Box as="button" onClick={() => router.push("/surveys/create")} _hover={{ bg: "gray.700" }} p={2} borderRadius="md" textAlign="left">
              설문지 만들기
            </Box>
            <Box as="button" onClick={() => router.push("/dashboard")} _hover={{ bg: "gray.700" }} p={2} borderRadius="md" textAlign="left">
              나의 설문지
            </Box>
          </VStack>
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
              _hover={{ bg: "blue.600" }}
              transition="background-color 0.2s"
            >
              <Heading size="md" mb={2}>
                새 설문지 만들기
              </Heading>
            </Box>
          </GridItem>
          {surveyList.map((survey) => (
            <GridItem key={survey.id}>
              <Box
                bg="white"
                p={6}
                rounded="lg"
                shadow="md"
                display="flex"
                height={"100%"}
                flexDirection="column"
                justifyContent="space-between"
                _hover={{ shadow: "lg" }}
                transition="box-shadow 0.2s"
              >
                <Heading size="md" mb={2}>
                  {survey.title}
                </Heading>
                <Box mb={4} fontSize="x-small">
                  {survey.description}
                </Box>
                <Box fontSize="sm" color="gray.500" mb={4}>
                  {survey.price === 0 || !survey.price ? "정산 설정되지 않음" : `정산 설정됨: ${survey.price} 원`}
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
                      _hover={{ bg: "blue.600" }}
                      transition="background-color 0.2s"
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
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/surveys/${survey.id}`);
                        toaster.create({
                          title: "링크가 복사되었습니다!",
                          duration: 4000,
                        });
                      }}
                      _hover={{ bg: "gray.600" }}
                      transition="background-color 0.2s"
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
                      _hover={{ bg: "green.600" }}
                      transition="background-color 0.2s"
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
                      _hover={{ bg: "red.600" }}
                      transition="background-color 0.2s"
                    >
                      설문조사 삭제하기
                    </Box>
                  </Grid>
                  {/* 통계 보기 */}
                  <Box
                    as="button"
                    bg="purple.500"
                    color="white"
                    p={1}
                    rounded="md"
                    fontSize="xs"
                    onClick={() => router.push(`/surveys/stats/${survey.id}`)}
                    _hover={{ bg: "purple.600" }}
                    transition="background-color 0.2s"
                  >
                    통계 보기
                  </Box>
                </Flex>
              </Box>
            </GridItem>
          ))}
        </Grid>
      </Box>
    </Flex>
  );
};
