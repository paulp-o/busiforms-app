import { Button } from "@/components/ui/button";
import { Card, Icon, Stack, Fieldset, Textarea } from "@chakra-ui/react";
import { CheckboxGroup } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { SendHorizontal } from "lucide-react";
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Message {
  content: string;
  isBot: boolean;
}

interface FormResponse {
  questions: Array<{
    questionType: string;
    text: string;
    options?: string[];
    visualizationType?: string;
  }>;
}

const ChatbotChat: React.FC<{
  givenPoll?: FormResponse;
  onFormUpdate: (data: FormResponse) => void;
  onLoadingChange?: (loading: boolean) => void;
}> = ({ givenPoll, onFormUpdate, onLoadingChange }) => {
  const [messages, setMessages] = useState<Message[]>([{ content: "설문지 작성을 도와드리겠습니다. 어떤 설문지를 만들고 싶으신가요?", isBot: true }]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentForm, setCurrentForm] = useState<FormResponse | null>(givenPoll || null);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  // 해커톤용 자동복사 스크립트
  // useEffect(() => {
  //   const message =
  //     "나는 커스텀 케이크샵을 운영하고 있어.\n원데이클래스를 열어야하는데 참여자 정보, 클래스를 알게 된 경로, 뭘 배우고 싶고 뭘 만들고 싶은지를 알고싶어.";
  //   navigator.clipboard
  //     .writeText(message)
  //     .then(() => {
  //       console.log("Message copied to clipboard");
  //     })
  //     .catch((err) => {
  //       console.error("Failed to copy message to clipboard: ", err);
  //     });
  // }, []);

  const inferVisualizationType = async (question: { questionType: string; text: string; options?: string[] }) => {
    try {
      const response = await fetch("http://localhost:3001/api/form-ai-loop/inferVisualizationType", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: JSON.stringify(question) }),
      });
      const data = await response.json();
      return data.visualizationType;
    } catch (error) {
      console.error("Error inferring visualization type:", error);
      return null;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    setIsLoading(true);
    onLoadingChange?.(true);
    const fieldsMessage = selectedFields.length > 0 ? `(필수 정보: ${selectedFields.join(", ")})` : "";
    const fullMessage = `${inputMessage} ${fieldsMessage}`.trim();
    setMessages((prev) => [...prev, { content: fullMessage, isBot: false }]);

    try {
      const response = await fetch("http://localhost:3001/api/form-ai-loop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: fullMessage,
          givenPoll: currentForm ? JSON.stringify(currentForm.questions) : "",
        }),
      });

      const data = await response.json();
      // Initialize with undefined visualization types
      const initialData = {
        ...data,
        questions: data.questions.map((q: { questionType: string; text: string; options?: string[] }) => ({
          ...q,
          visualizationType: undefined,
        })),
      };
      setCurrentForm(initialData);
      onFormUpdate(initialData);

      // Stop showing the loading spinner for the entire preview
      setIsLoading(false);
      onLoadingChange?.(false);

      // Infer visualization type for each question in the background sequentially with a delay
      for (const [index, question] of data.questions.entries()) {
        const visualizationType = await inferVisualizationType(question);
        if (visualizationType !== null) {
          setCurrentForm((prevForm: FormResponse | null) => {
            if (!prevForm) return null;
            const updatedQuestions = [...prevForm.questions];
            updatedQuestions[index].visualizationType = visualizationType;
            const updatedForm: FormResponse = { ...prevForm, questions: updatedQuestions };
            onFormUpdate(updatedForm);
            return updatedForm;
          });
        }
        await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay
      }

      // Customize message based on whether it's a modification or new form
      const responseMessage = currentForm
        ? `설문지가 수정되었습니다. 추가로 수정하실 내용이 있으신가요?`
        : `새로운 설문지가 생성되었습니다. 수정하실 내용이 있으신가요?`;
      setMessages((prev) => [...prev, { content: responseMessage, isBot: true }]);
    } catch (error) {
      setMessages((prev) => [...prev, { content: "죄송합니다. 오류가 발생했습니다.", isBot: true }]);
      console.log(error);
    } finally {
      setInputMessage("");
    }
  };

  return (
    <div>
      <p className="text-sm">챗봇에게 설문지 수정을 요청해 보세요.</p>

      <Fieldset.Root p="2" my="3" borderRadius="md" borderColor="gray" borderWidth="1px">
        <CheckboxGroup onValueChange={setSelectedFields} name="requiredFields">
          <Fieldset.Legend fontSize="sm" mb="2">
            답변자 필수 정보 선택
          </Fieldset.Legend>
          <Fieldset.Content>
            <Stack direction="row" flexWrap="wrap" gap={2}>
              {["성별", "이름", "나이", "전화번호", "이메일"].map((field) => (
                <Stack align="left" flex="1 1 45%" key={field}>
                  <Checkbox value={field} variant="solid">
                    {field}
                  </Checkbox>
                </Stack>
              ))}
            </Stack>
          </Fieldset.Content>
        </CheckboxGroup>
      </Fieldset.Root>

      <Card.Root>
        <div className="overflow-y-auto h-full" style={{ maxHeight: "calc(70vh - 200px)" }}>
          <Card.Body p={"3"}>
            <ChatBubbleList messages={messages} />
          </Card.Body>
        </div>
      </Card.Root>
      <Stack direction="row" justifyContent="space-between" alignItems="center" pt={"3"}>
        <Textarea
          variant="subtle"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message here..."
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={isLoading}
          style={{ overflow: "hidden", resize: "none", width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          rows={1}
          onInput={(e) => {
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
          }}
        />
        <Button variant="solid" onClick={handleSendMessage} disabled={isLoading} size="sm" className="bg-[#515151] hover:bg-[#515151]/90 text-white">
          {isLoading ? (
            <div> {/* <LoadingSpinner /> */}</div>
          ) : (
            <div className="flex items-center">
              <Icon boxSize={4}>
                <SendHorizontal />
              </Icon>
              <span className="ml-1 text-sm">Send</span>
            </div>
          )}
        </Button>
      </Stack>
    </div>
  );
};

const ChatBubbleList: React.FC<{ messages: Message[] }> = ({ messages }) => {
  return (
    <div>
      {messages.map((message, index) => (
        <div key={index} className={`chat ${message.isBot ? "chat-start" : "chat-end"} relative`}>
          {message.isBot && (
            <div className="chat-image avatar">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image src="/images/chatbot.png" alt="Chatbot" width={32} height={32} />
              </div>
            </div>
          )}
          <div className={`chat-bubble text-sm font-inter ${message.isBot ? "bg-[#3953D5] text-white" : "bg-[#DFE7FA] text-gray-800"}`}>
            {message.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatbotChat;
