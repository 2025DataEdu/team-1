
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Supabase 클라이언트 생성
const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

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

    // 실제 데이터베이스에서 데이터 조회
    let contextData = '';
    
    try {
      // API 호출 데이터 조회
      const { data: apiCallData, error: apiError } = await supabase
        .from('api_call')
        .select('목록명, 호출건수, 통계일자, 등록기관, 분류체계')
        .order('호출건수', { ascending: false })
        .limit(50);

      if (apiError) {
        console.error('API call data error:', apiError);
      } else if (apiCallData && apiCallData.length > 0) {
        contextData += `\n**실시간 API 호출 데이터 (TOP 50):**\n`;
        apiCallData.forEach((item, index) => {
          if (item.목록명 && item.호출건수) {
            contextData += `${index + 1}. ${item.목록명} - ${item.호출건수}건 (${item.등록기관 || '기관명 없음'})\n`;
          }
        });
      }

      // OpenData 테이블에서 최신 등록 데이터 조회
      const { data: openData, error: openError } = await supabase
        .from('openData')
        .select('목록명, 등록일, 기관명, 분류체계')
        .order('등록일', { ascending: false })
        .limit(20);

      if (openError) {
        console.error('OpenData error:', openError);
      } else if (openData && openData.length > 0) {
        contextData += `\n**최신 등록 데이터 (TOP 20):**\n`;
        openData.forEach((item, index) => {
          if (item.목록명) {
            contextData += `${index + 1}. ${item.목록명} - ${item.등록일 || '날짜 없음'} (${item.기관명 || '기관명 없음'})\n`;
          }
        });
      }

      // 2024년 데이터 특별 조회
      const { data: data2024, error: error2024 } = await supabase
        .from('api_call')
        .select('목록명, 호출건수, 등록기관')
        .gte('통계일자', '2024-01-01')
        .lte('통계일자', '2024-12-31')
        .order('호출건수', { ascending: false })
        .limit(10);

      if (error2024) {
        console.error('2024 data error:', error2024);
      } else if (data2024 && data2024.length > 0) {
        contextData += `\n**2024년 가장 많이 호출된 API TOP 10:**\n`;
        data2024.forEach((item, index) => {
          if (item.목록명 && item.호출건수) {
            contextData += `${index + 1}. ${item.목록명} - ${item.호출건수}건 (${item.등록기관 || '기관명 없음'})\n`;
          }
        });
      }

    } catch (dbError) {
      console.error('Database query error:', dbError);
      contextData = '\n**데이터베이스 연결 오류로 인해 실시간 데이터를 불러올 수 없습니다.**\n';
    }

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
            content: `당신은 국토교통부 공공데이터포털 현황 대시보드의 전문 AI 어시스턴트입니다. 실시간 데이터베이스에서 조회한 정보를 바탕으로 정확한 답변을 제공해주세요.

**실시간 데이터베이스 정보:**${contextData}

**답변 가이드라인:**
1. 위 실시간 데이터를 우선적으로 활용하여 답변하세요
2. 2024년 관련 질문에는 실제 2024년 데이터를 참조하세요
3. API 호출 순위나 통계 질문에는 실제 호출건수 데이터를 제공하세요
4. 질문이 불명확할 때는 구체적인 카테고리나 데이터 유형을 물어보세요
5. 국토교통부 공공데이터에 관련된 질문에만 답변하세요
6. 간결하고 명확하게 답변하되, 필요시 구체적인 수치를 제공하세요

데이터베이스에 실제 데이터가 있을 때는 그 정보를 우선 사용하고, 데이터가 없거나 오류가 있을 때만 일반적인 안내를 제공하세요.

질문이 대시보드 범위를 벗어나면 "죄송하지만, 국토교통부 공공데이터포털 현황에 대한 질문만 답변드릴 수 있습니다"라고 안내해주세요.`
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 500,
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
