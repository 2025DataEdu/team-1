
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// 하드코딩된 API 키
const OPENAI_API_KEY = "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";

const ChatBot = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    setIsLoading(true);
    const userQuestion = inputMessage;
    setInputMessage("");

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `당신은 국토교통부 공공데이터 현황 대시보드의 전문 어시스턴트입니다. 
              
              대시보드 정보:
              - 총 데이터셋: 1,247개 (전월 대비 +12.5%)
              - 활용 건수: 45,829건 (전월 대비 +18.3%)
              - 다운로드: 23,567건 (전월 대비 +25.1%)
              - API 호출: 892K건 (전월 대비 +31.2%)
              
              주요 카테고리:
              - 교통정보: 287개 데이터셋
              - 부동산: 195개 데이터셋
              - 건설: 158개 데이터셋
              - 항공: 142개 데이터셋
              - 철도: 125개 데이터셋
              - 해운: 98개 데이터셋
              - 기타: 242개 데이터셋
              
              인기 데이터:
              1. 실시간 교통정보 (HOT)
              2. 부동산 실거래가 (인기)
              3. 건축물 대장 (추천)
              
              한국어로 친절하고 정확하게 답변해주세요. 간결하고 명확하게 설명해주세요.`,
            },
            {
              role: "user",
              content: userQuestion,
            },
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }

      const data = await response.json();
      const answer = data.choices[0].message.content;
      
      toast({
        title: "AI 어시스턴트 답변",
        description: answer,
        duration: 10000,
      });

    } catch (error) {
      console.error("ChatGPT API 오류:", error);
      toast({
        title: "오류 발생",
        description: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="bg-white shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <MessageCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <div className="flex-1 flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="대시보드에 대해 궁금한 점을 물어보세요... (예: 부동산 데이터는 어떤 것들이 있나요?)"
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              size="icon"
              className="flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {isLoading && (
          <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
            <span>AI가 답변을 준비 중입니다...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatBot;
