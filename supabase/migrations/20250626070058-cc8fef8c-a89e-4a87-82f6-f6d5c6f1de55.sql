
-- files_download 테이블에 Row Level Security 활성화
ALTER TABLE public.files_download ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 files_download 테이블을 읽을 수 있도록 허용하는 정책 생성
CREATE POLICY "Anyone can view files_download data" 
  ON public.files_download 
  FOR SELECT 
  TO public 
  USING (true);

-- openData 테이블에 Row Level Security 활성화 (대소문자 구분하여 수정)
ALTER TABLE public."openData" ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 openData 테이블을 읽을 수 있도록 허용하는 정책 생성
CREATE POLICY "Anyone can view openData data" 
  ON public."openData" 
  FOR SELECT 
  TO public 
  USING (true);
