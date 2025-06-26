
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({ error: 'API 키가 설정되지 않았습니다.' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: '메시지가 필요합니다.' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Processing message:', message);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
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

질문이 대시보드 범위를 벗어나면 "죄송하지만, 국토교통부 공공데이터포털 현황에 대한 질문만 답변드릴 수 있습니다"라고 안내해주세요.`
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 400,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      return new Response(
        JSON.stringify({ error: `OpenAI API 오류: ${response.status}` }), 
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    const answer = data.choices[0]?.message?.content;

    if (!answer) {
      console.error('No answer received from OpenAI');
      return new Response(
        JSON.stringify({ error: '응답을 받지 못했습니다.' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Successfully processed message');
    
    return new Response(
      JSON.stringify({ answer }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
