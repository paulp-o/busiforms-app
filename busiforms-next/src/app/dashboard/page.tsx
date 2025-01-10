"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/layout/Header/Header";
import { useAuth } from "@/hooks/useAuth";
import { Flex, VStack, Box, Heading, Grid, GridItem, Spinner, Text } from "@chakra-ui/react";
import { FaPlus, FaClipboard, FaEdit, FaTrash, FaPoll } from "react-icons/fa";

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
    <div className="min-h-screen bg-[#FAFAFA]">
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
        bg="white"
        color="gray.700"
        p={8}
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        borderRight="1px"
        borderColor="gray.100"
        position="relative"
      >
        <VStack align="stretch" gap={8}>
          <VStack align="center" gap={4}>
            <Box
              position="relative"
              w="120px"
              h="120px"
              borderRadius="full"
              bg="blue.500"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="3xl"
              fontWeight="bold"
              color="white"
              overflow="hidden"
              border="4px solid white"
              boxShadow="0 0 0 2px #E2E8F0, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              _hover={{
                transform: "scale(1.02)",
                transition: "all 0.2s ease"
              }}
            >
              {user.username[0].toUpperCase()}
            </Box>
            <VStack gap={1}>
              <Text fontSize="lg" fontWeight="bold" color="gray.800">
                {user.username}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {user.email}
              </Text>
            </VStack>
          </VStack>
          <VStack align="stretch" gap={3}>
            <Box
              as="button"
              onClick={() => router.push("/surveys/create")}
              bg="white"
              p={3.5}
              borderRadius="xl"
              transition="all 0.2s ease"
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="1px solid"
              borderColor="gray.200"
              boxShadow="sm"
              _hover={{
                bg: "gray.50",
                transform: "translateY(-1px)",
                boxShadow: "md",
                borderColor: "gray.300"
              }}
            >
              <FaPlus />
              <Text fontSize="sm" fontWeight="medium" color="gray.700">설문지 만들기</Text>
            </Box>
            <Box
              as="button"
              onClick={() => router.push("/dashboard")}
              bg="blue.500"
              p={3.5}
              borderRadius="xl"
              transition="all 0.2s ease"
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              border="1px solid"
              borderColor="blue.600"
              boxShadow="sm"
              _hover={{
                bg: "blue.600",
                transform: "translateY(-1px)",
                boxShadow: "md",
                borderColor: "blue.700"
              }}
            >
              <FaPoll />
              <Text fontSize="sm" fontWeight="medium">나의 설문지</Text>
            </Box>
          </VStack>
        </VStack>
      </Box>
      {/* 메인 콘텐츠 */}
      {/* 우측 패널 */}
      <Box flex="1" p={10} bg="white" borderLeft="1px" borderColor="gray.100">
        <Heading size="lg" mb={8} color="#2E3A59" letterSpacing="tight">
          나의 설문지
        </Heading>
        <Grid templateColumns="repeat(3, 1fr)" gap={8}>
          <GridItem>
            <Box
              bg="linear-gradient(145deg, #7195E9, #4F71E2)"
              color="white"
              height="100%"
              p={8}
              rounded="2xl"
              shadow="lg"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              onClick={() => router.push("/surveys/create")}
              _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
              transition="all 0.2s"
              position="relative"
              overflow="hidden"
              _after={{
                content: '""',
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
                pointerEvents: "none"
              }}
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
                p={8}
                rounded="2xl"
                shadow="lg"
                display="flex"
                height={"100%"}
                flexDirection="column"
                justifyContent="space-between"
                _hover={{ shadow: "xl", transform: "translateY(-2px)" }}
                transition="all 0.2s"
                border="1px solid rgba(0,0,0,0.05)"
              >
                <Heading size="md" mb={3} color="#2E3A59">
                  {survey.title}
                </Heading>
                <Box mb={4} fontSize="sm" color="#4A5568">
                  {survey.description}
                </Box>
                <Box fontSize="sm" color="#718096" mb={2}>
                  {new Date(survey.createdAt).toLocaleDateString()}
                </Box>
                <Box fontFamily="monospace" fontSize="xs" mb={6} color="#A0AEC0">
                  {survey.id}
                </Box>
                <Flex direction="column" gap={3}>
                  <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                    <Box
                      as="button"
                      bg="linear-gradient(145deg, #7195E9, #4F71E2)"
                      color="white"
                      p={2}
                      rounded="lg"
                      fontSize="sm"
                      onClick={() => router.push(`/surveys/${survey.id}`)}
                      _hover={{ transform: "translateY(-1px)", shadow: "md" }}
                      transition="all 0.2s"
                      boxShadow="0 2px 10px rgba(113,149,233,0.2)"
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      <FaPoll />
                      바로가기
                    </Box>
                    <Box
                      as="button"
                      bg="linear-gradient(145deg, #9FBAF1, #7195E9)"
                      color="white"
                      p={2}
                      rounded="lg"
                      fontSize="sm"
                      onClick={() => navigator.clipboard.writeText(`${window.location.origin}/surveys/${survey.id}`)}
                      _hover={{ transform: "translateY(-1px)", shadow: "md" }}
                      transition="all 0.2s"
                      boxShadow="0 2px 10px rgba(159,186,241,0.2)"
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      <FaClipboard />
                      링크 복사하기
                    </Box>
                    <Box
                      as="button"
                      bg="linear-gradient(145deg, #7195E9, #4F71E2)"
                      color="white"
                      p={2}
                      rounded="lg"
                      fontSize="sm"
                      onClick={() =>
                        router.push(
                          `/surveys/create?edit=true&id=${survey.id}&title=${encodeURIComponent(survey.title)}&description=${encodeURIComponent(
                            survey.description
                          )}`
                        )
                      }
                      _hover={{ transform: "translateY(-1px)", shadow: "md" }}
                      transition="all 0.2s"
                      boxShadow="0 2px 10px rgba(113,149,233,0.2)"
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      <FaEdit />
                      수정하기
                    </Box>
                    <Box
                      as="button"
                      bg="linear-gradient(145deg, #9FBAF1, #7195E9)"
                      color="white"
                      p={2}
                      rounded="lg"
                      fontSize="sm"
                      onClick={() => {
                        if (confirm("정말로 삭제하시겠습니까?")) {
                          axios.delete(`http://localhost:3001/api/surveys/${survey.id}`).then(() => {
                            setSurveyList(surveyList.filter((s) => s.id !== survey.id));
                          });
                        }
                      }}
                      _hover={{ transform: "translateY(-1px)", shadow: "md" }}
                      transition="all 0.2s"
                      boxShadow="0 2px 10px rgba(159,186,241,0.2)"
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      <FaTrash />
                      삭제하기
                    </Box>
                  </Grid>
                  <Box
                    as="button"
                    bg="linear-gradient(145deg, #3142C4, #4F71E2)"
                    color="white"
                    p={2}
                    rounded="lg"
                    fontSize="sm"
                    onClick={() => router.push(`/surveys/stats/${survey.id}`)}
                    _hover={{ transform: "translateY(-1px)", shadow: "md" }}
                    transition="all 0.2s"
                    boxShadow="0 2px 10px rgba(49,66,196,0.2)"
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
