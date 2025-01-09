import Input from "@/components/common/Input/Input";
import { Button } from "@/components/ui/button";
import { Card, Icon, Stack, Spinner } from "@chakra-ui/react";
import { SendHorizontal } from "lucide-react";
import React, { useState } from "react";

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

const ChatbotChat: React.FC<{ onSurveyUpdate: (data: SurveyResponse) => void }> = ({ onSurveyUpdate }) => {
  const [messages, setMessages] = useState<Message[]>([{ content: "설문지 작성을 도와드리겠습니다. 어떤 설문지를 만들고 싶으신가요?", isBot: true }]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSurvey, setCurrentSurvey] = useState<SurveyResponse | null>(null);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { content: inputMessage, isBot: false }]);

    try {
      const response = await fetch("http://localhost:3001/api/survey-ai-loop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: inputMessage,
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
      setInputMessage("");
    }
  };

  return (
    <div>
      <p>챗봇에게 설문지 수정을 요청해 보세요.</p>

      <Card.Root>
        <div className="overflow-y-auto h-full">
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
        <Button variant="solid" onClick={handleSendMessage} disabled={isLoading}>
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <div>
              <Icon>
                <SendHorizontal />
              </Icon>
              Send
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
          <div className={`chat-bubble ${message.isBot ? "chat-bubble-primary" : "chat-bubble-success"}`}>{message.content}</div>
        </div>
      ))}
    </div>
  );
};

export default ChatbotChat;
