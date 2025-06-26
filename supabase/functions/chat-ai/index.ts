
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

// 질문 분석 및 쿼리 생성 함수
const generateQueryFromQuestion = async (question: string) => {
  const queryPrompt = `
다음 질문을 분석하여 적절한 데이터베이스 쿼리 정보를 생성해주세요.

사용 가능한 테이블:
1. api_call: API 호출 통계 (목록명, 호출건수, 통계일자, 등록기관, 분류체계)
2. openData: 공공데이터 목록 (목록명, 등록일, 기관명, 분류체계, 마지막수정일)
3. files_downlload: 파일 다운로드 통계 (목록명, 다운로드수, 등록기관, 통계일자)

질문: "${question}"

응답 형식 (JSON):
{
  "queryType": "api_call|openData|files_downlload|multiple",
  "filters": {
    "year": "YYYY",
    "category": "카테고리명",
    "institution": "기관명",
    "limit": 숫자
  },
  "orderBy": "호출건수|다운로드수|등록일",
  "queryDescription": "쿼리 설명"
}
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: queryPrompt },
          { role: 'user', content: question }
        ],
        max_tokens: 300,
        temperature: 0.1,
      }),
    });

    const data = await response.json();
    const queryInfo = JSON.parse(data.choices[0]?.message?.content || '{}');
    return queryInfo;
  } catch (error) {
    console.error('Query generation error:', error);
    return null;
  }
};

// 데이터베이스 쿼리 실행 함수
const executeQuery = async (queryInfo: any) => {
  try {
    let query;
    let results = [];

    if (queryInfo.queryType === 'api_call') {
      query = supabase.from('api_call').select('목록명, 호출건수, 등록기관, 통계일자, 분류체계');
      
      if (queryInfo.filters?.year) {
        query = query.gte('통계일자', `${queryInfo.filters.year}-01-01`)
                    .lte('통계일자', `${queryInfo.filters.year}-12-31`);
      }
      
      if (queryInfo.filters?.institution) {
        query = query.ilike('등록기관', `%${queryInfo.filters.institution}%`);
      }
      
      if (queryInfo.filters?.category) {
        query = query.ilike('분류체계', `%${queryInfo.filters.category}%`);
      }
      
      if (queryInfo.orderBy === '호출건수') {
        query = query.order('호출건수', { ascending: false });
      }
      
      if (queryInfo.filters?.limit) {
        query = query.limit(queryInfo.filters.limit);
      }
      
      const { data, error } = await query;
      if (!error && data) results = data;
      
    } else if (queryInfo.queryType === 'openData') {
      query = supabase.from('openData').select('목록명, 등록일, 기관명, 분류체계, 마지막수정일');
      
      if (queryInfo.filters?.year) {
        query = query.gte('등록일', `${queryInfo.filters.year}-01-01`)
                    .lte('등록일', `${queryInfo.filters.year}-12-31`);
      }
      
      if (queryInfo.filters?.institution) {
        query = query.ilike('기관명', `%${queryInfo.filters.institution}%`);
      }
      
      if (queryInfo.orderBy === '등록일') {
        query = query.order('등록일', { ascending: false });
      }
      
      if (queryInfo.filters?.limit) {
        query = query.limit(queryInfo.filters.limit);
      }
      
      const { data, error } = await query;
      if (!error && data) results = data;
      
    } else if (queryInfo.queryType === 'files_downlload') {
      query = supabase.from('files_downlload').select('목록명, 다운로드수, 등록기관, 통계일자, 분류체계');
      
      if (queryInfo.filters?.year) {
        query = query.gte('통계일자', `${queryInfo.filters.year}-01-01`)
                    .lte('통계일자', `${queryInfo.filters.year}-12-31`);
      }
      
      if (queryInfo.orderBy === '다운로드수') {
        query = query.order('다운로드수', { ascending: false });
      }
      
      if (queryInfo.filters?.limit) {
        query = query.limit(queryInfo.filters.limit);
      }
      
      const { data, error } = await query;
      if (!error && data) results = data;
    }

    return {
      success: true,
      data: results,
      queryDescription: queryInfo.queryDescription
    };
    
  } catch (error) {
    console.error('Query execution error:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
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

    // 1. 질문 분석 및 쿼리 정보 생성
    const queryInfo = await generateQueryFromQuestion(message);
    console.log('Generated query info:', queryInfo);

    // 2. 데이터베이스 쿼리 실행
    let queryResults = null;
    if (queryInfo && queryInfo.queryType) {
      queryResults = await executeQuery(queryInfo);
      console.log('Query results:', queryResults);
    }

    // 3. 기본 컨텍스트 데이터도 함께 제공
    let contextData = '';
    
    try {
      // 최신 API 호출 데이터
      const { data: apiCallData, error: apiError } = await supabase
        .from('api_call')
        .select('목록명, 호출건수, 통계일자, 등록기관, 분류체계')
        .order('호출건수', { ascending: false })
        .limit(20);

      if (!apiError && apiCallData && apiCallData.length > 0) {
        contextData += `\n**최신 API 호출 데이터 (TOP 20):**\n`;
        apiCallData.forEach((item, index) => {
          if (item.목록명 && item.호출건수) {
            contextData += `${index + 1}. ${item.목록명} - ${item.호출건수}건 (${item.등록기관 || '기관명 없음'})\n`;
          }
        });
      }

    } catch (dbError) {
      console.error('Database context query error:', dbError);
    }

    // 4. AI 응답 생성
    let systemPrompt = `당신은 국토교통부 공공데이터포털 현황 대시보드의 전문 AI 어시스턴트입니다.

**데이터베이스 쿼리 결과:**`;

    if (queryResults && queryResults.success && queryResults.data.length > 0) {
      systemPrompt += `
쿼리 설명: ${queryResults.queryDescription}
결과 데이터:
${JSON.stringify(queryResults.data, null, 2)}`;
    } else if (queryResults && !queryResults.success) {
      systemPrompt += `
쿼리 실행 중 오류 발생: ${queryResults.error}`;
    } else {
      systemPrompt += `
특정 쿼리 결과 없음 - 일반 컨텍스트 데이터 사용`;
    }

    systemPrompt += `

**일반 컨텍스트 데이터:**${contextData}

**답변 가이드라인:**
1. 위 쿼리 결과를 우선적으로 활용하여 정확한 답변을 제공하세요
2. 구체적인 수치와 데이터를 기반으로 답변하세요
3. 2024년이나 특정 연도 관련 질문에는 해당 연도 데이터를 정확히 참조하세요
4. 순위나 통계 질문에는 실제 데이터를 바탕으로 순위를 제공하세요
5. 질문이 불명확할 때는 구체적인 조건을 물어보세요
6. 국토교통부 공공데이터에 관련된 질문에만 답변하세요
7. 간결하고 명확하게 답변하되, 근거가 되는 데이터를 함께 제시하세요

질문이 대시보드 범위를 벗어나면 "죄송하지만, 국토교통부 공공데이터포털 현황에 대한 질문만 답변드릴 수 있습니다"라고 안내해주세요.`;

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
            content: systemPrompt
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 600,
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

    console.log('Successfully processed message with query-based response');
    
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
