
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send, Bot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ChatBot = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [latestResponse, setLatestResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userQuestion = inputMessage;
    setInputMessage("");
    setLatestResponse("");
    setIsLoading(true);

    try {
      console.log('Sending message to Edge Function:', userQuestion);
      
      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: { message: userQuestion }
      });

      if (error) {
        console.error('Edge Function error:', error);
        throw new Error(error.message || '서버 오류가 발생했습니다.');
      }

      if (!data || !data.answer) {
        console.error('Invalid response from Edge Function:', data);
        throw new Error('유효하지 않은 응답을 받았습니다.');
      }

      console.log('Received response from Edge Function');
      setLatestResponse(data.answer);

    } catch (error) {
      console.error('ChatBot error:', error);
      const errorMessage = error instanceof Error ? error.message : '일시적인 오류가 발생했습니다.';
      
      setLatestResponse(errorMessage);
      toast({
        title: "오류 발생",
        description: errorMessage,
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

        {/* 최신 응답만 표시 */}
        {latestResponse && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 bg-gray-100 text-gray-800 p-3 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{latestResponse}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatBot;
