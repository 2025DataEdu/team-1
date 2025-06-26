
-- api_call 테이블에 Row Level Security 활성화
ALTER TABLE public.api_call ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 api_call 테이블을 읽을 수 있도록 허용하는 정책 생성
CREATE POLICY "Anyone can view api_call data" 
  ON public.api_call 
  FOR SELECT 
  TO public 
  USING (true);
