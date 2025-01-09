import Input from "@/components/common/Input/Input";
import { Button } from "@/components/ui/button";
import { Card, Icon, Stack, Spinner, Fieldset } from "@chakra-ui/react";
import { CheckboxGroup } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { SendHorizontal } from "lucide-react";
import React, { useState } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface Message {
  content: string;
  isBot: boolean;
}

interface SurveyResponse {
  questions: Array<{
    questionType: string;
    text: string;
    options?: string[];
  }>;
}

const ChatbotChat: React.FC<{
  givenPoll?: SurveyResponse;
  onSurveyUpdate: (data: SurveyResponse) => void;
  onLoadingChange?: (loading: boolean) => void;
}> = ({ givenPoll, onSurveyUpdate, onLoadingChange }) => {
  const [messages, setMessages] = useState<Message[]>([{ content: "설문지 작성을 도와드리겠습니다. 어떤 설문지를 만들고 싶으신가요?", isBot: true }]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSurvey, setCurrentSurvey] = useState<SurveyResponse | null>(givenPoll || null);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    setIsLoading(true);
    onLoadingChange?.(true);
    const fieldsMessage = selectedFields.length > 0 ? `(필수 정보: ${selectedFields.join(", ")})` : "";
    const fullMessage = `${inputMessage} ${fieldsMessage}`.trim();
    setMessages((prev) => [...prev, { content: fullMessage, isBot: false }]);

    try {
      const response = await fetch("http://localhost:3001/api/survey-ai-loop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: fullMessage,
          givenPoll: currentSurvey ? JSON.stringify(currentSurvey.questions) : "",
        }),
      });

      const data = await response.json();
      setCurrentSurvey(data);
      onSurveyUpdate(data);

      // Customize message based on whether it's a modification or new survey
      const responseMessage = currentSurvey
        ? `설문지가 수정되었습니다. 추가로 수정하실 내용이 있으신가요?`
        : `새로운 설문지가 생성되었습니다. 수정하실 내용이 있으신가요?`;
      setMessages((prev) => [...prev, { content: responseMessage, isBot: true }]);
    } catch (error) {
      setMessages((prev) => [...prev, { content: "죄송합니다. 오류가 발생했습니다.", isBot: true }]);
      console.log(error);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
      setInputMessage("");
    }
  };

  return (
    <div>
      <p className="text-sm">챗봇에게 설문지 수정을 요청해 보세요.</p>

      <Fieldset.Root p="2" m="2">
        <CheckboxGroup onValueChange={setSelectedFields} name="requiredFields">
          <Fieldset.Legend fontSize="sm" mb="2">
            답변자 필수 정보 선택
          </Fieldset.Legend>
          <Fieldset.Content>
            <Stack direction="row" flexWrap="wrap" gap={2}>
              {["성별", "이름", "나이", "전화번호"].map((field) => (
                <Stack align="left" flex="1 1 45%" key={field}>
                  <Checkbox value={field}>{field}</Checkbox>
                </Stack>
              ))}
            </Stack>
          </Fieldset.Content>
        </CheckboxGroup>
      </Fieldset.Root>

      <Card.Root>
        <div className="overflow-y-auto h-full" style={{ maxHeight: "calc(70vh - 200px)" }}>
          <Card.Body>
            <ChatBubbleList messages={messages} />
          </Card.Body>
        </div>
      </Card.Root>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message here..."
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={isLoading}
        />
        <Button variant="solid" onClick={handleSendMessage} disabled={isLoading} size="sm">
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
        <div key={index} className={`chat ${message.isBot ? "chat-start" : "chat-end"}`}>
          <div className={`chat-bubble ${message.isBot ? "chat-bubble-primary" : "chat-bubble-success"} text-sm`}>{message.content}</div>
        </div>
      ))}
    </div>
  );
};

export default ChatbotChat;
