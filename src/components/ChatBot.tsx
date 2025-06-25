
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send, Bot, User } from "lucide-react";

// 하드코딩된 API 키
const OPENAI_API_KEY = "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";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatBot = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userQuestion = inputMessage;
    setInputMessage("");
    
    // 사용자 메시지 추가
    setMessages(prev => [...prev, { role: 'user', content: userQuestion }]);
    setIsLoading(true);

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
              content: `당신은 국토교통부 공공데이터포털 현황 대시보드의 전문 AI 어시스턴트입니다. 공공데이터포털에 등록된 국토교통부 개방데이터에 대한 정확한 정보만을 제공해주세요.

**현재 대시보드 통계 (2024년 6월 기준):**

🏢 **공공데이터포털 전체:**
- 총 데이터셋: 24,892개 (+5.2%)
- 총 활용건수: 1,247,892건 (+18.3%)
- 총 다운로드: 523,567건 (+25.1%)
- 총 API 호출: 3.2M건 (+31.2%)

🏛️ **국토교통부 데이터 (공공데이터포털 내):**
- 데이터셋 수: 3,247개 (전체의 13.0%, +8.1%)
- 활용건수: 458,291건 (전체의 36.8%, +22.1%)
- 다운로드: 187,432건 (전체의 35.8%, +28.7%)
- API 호출: 892K건 (전체의 27.9%, +35.8%)

📊 **카테고리별 데이터셋 분포:**
- 교통정보: 287개 (다운로드 15,420건)
- 부동산: 195개 (다운로드 12,380건)
- 건설: 158개 (다운로드 8,950건)
- 항공: 142개 (다운로드 7,630건)
- 철도: 125개 (다운로드 6,890건)
- 해운: 98개 (다운로드 5,210건)
- 기타: 242개 (다운로드 9,850건)

🔥 **API 호출 TOP 10 (월간):**
1. 실시간 교통정보 (한국도로공사) - 892,000건 (+15.2%)
2. 부동산 실거래가 조회 (국토교통부) - 756,000건 (+12.8%)
3. 항공기 운항정보 (한국공항공사) - 634,000건 (+8.9%)
4. 철도 운행정보 (한국철도공사) - 523,000건 (+6.4%)
5. 버스 도착정보 (교통안전공단) - 445,000건 (+10.1%)
6. 지적도 정보 (국토지리정보원) - 389,000건 (+5.3%)
7. 건축물 대장정보 (건축도시공간연구소) - 321,000건 (+7.2%)
8. 항만 입출항 정보 (해양수산부) - 287,000건 (+4.8%)
9. 교통사고 통계 (도로교통공단) - 245,000건 (+3.6%)
10. 건설공사 정보 (대한건설협회) - 198,000건 (+2.9%)

📥 **파일 다운로드 TOP 10 (월간):**
1. 부동산 실거래가 데이터 (국토교통부) - 45,892건 (+18.3%)
2. 교통사고 통계 데이터 (도로교통공단) - 38,421건 (+14.7%)
3. 건축물 대장 데이터 (건축도시공간연구소) - 32,156건 (+11.9%)
4. 지적도 Shape 파일 (국토지리정보원) - 28,734건 (+9.8%)
5. 항만 물동량 통계 (해양수산부) - 25,683건 (+8.4%)
6. 철도역 정보 데이터 (한국철도공사) - 22,457건 (+7.1%)
7. 공항 시설정보 (한국공항공사) - 19,832건 (+6.3%)
8. 도로명 주소 데이터 (행정안전부) - 17,596건 (+5.2%)
9. 건설공사 현황 (대한건설협회) - 15,284건 (+4.6%)
10. 교통량 조사 데이터 (한국도로공사) - 13,947건 (+3.8%)

**답변 가이드라인:**
1. 위 데이터를 기반으로 정확한 통계와 수치를 제공하세요
2. 질문이 불명확할 때는 구체적인 카테고리나 데이터 유형을 물어보세요
3. 국토교통부 공공데이터에 관련된 질문에만 답변하세요
4. 데이터 활용 방법이나 API 사용법에 대해서도 안내할 수 있습니다
5. 간결하고 명확하게 답변하되, 필요시 구체적인 수치를 제공하세요

질문이 대시보드 범위를 벗어나면 "죄송하지만, 국토교통부 공공데이터포털 현황에 대한 질문만 답변드릴 수 있습니다"라고 안내해주세요.`,
            },
            {
              role: "user",
              content: userQuestion,
            },
          ],
          max_tokens: 400,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }

      const data = await response.json();
      const answer = data.choices[0].message.content;
      
      // AI 답변 추가
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);

    } catch (error) {
      console.error("ChatGPT API 오류:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' 
      }]);
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
        {/* 입력창 */}
        <div className="flex items-center space-x-3 mb-4">
          <MessageCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <div className="flex-1 flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="국토교통부 공공데이터에 대해 궁금한 점을 물어보세요... (예: 교통정보 데이터 종류는?)"
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

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
            <span>AI가 답변을 준비 중입니다...</span>
          </div>
        )}

        {/* 메시지 목록 */}
        {messages.length > 0 && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white ml-auto'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatBot;
