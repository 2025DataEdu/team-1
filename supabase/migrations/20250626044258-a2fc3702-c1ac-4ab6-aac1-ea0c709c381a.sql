
-- 월별 통계 데이터를 저장할 테이블 생성
CREATE TABLE public.monthly_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  total_datasets INTEGER DEFAULT 0,
  national_transport_datasets INTEGER DEFAULT 0,
  total_downloads INTEGER DEFAULT 0,
  total_api_calls INTEGER DEFAULT 0,
  updated_datasets INTEGER DEFAULT 0,
  outdated_datasets INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(year, month)
);

-- 샘플 데이터 삽입 (2023년 1월부터 2024년 12월까지)
INSERT INTO public.monthly_stats (year, month, total_datasets, national_transport_datasets, total_downloads, total_api_calls, updated_datasets, outdated_datasets) VALUES
-- 2023년 데이터
(2023, 1, 23500, 420, 135000, 850000, 380, 40),
(2023, 2, 23600, 425, 140000, 890000, 385, 40),
(2023, 3, 23700, 430, 145000, 920000, 390, 40),
(2023, 4, 23800, 435, 150000, 950000, 395, 45),
(2023, 5, 23900, 440, 155000, 980000, 400, 45),
(2023, 6, 24000, 445, 160000, 1010000, 405, 45),
(2023, 7, 24100, 450, 165000, 1040000, 410, 50),
(2023, 8, 24200, 455, 170000, 1070000, 415, 50),
(2023, 9, 24300, 460, 175000, 1100000, 420, 50),
(2023, 10, 24400, 465, 180000, 1130000, 425, 55),
(2023, 11, 24500, 470, 185000, 1160000, 430, 55),
(2023, 12, 24600, 475, 190000, 1190000, 435, 55),
-- 2024년 데이터
(2024, 1, 24650, 478, 195000, 1220000, 440, 60),
(2024, 2, 24700, 481, 200000, 1250000, 445, 60),
(2024, 3, 24750, 484, 205000, 1280000, 450, 60),
(2024, 4, 24800, 487, 210000, 1310000, 455, 65),
(2024, 5, 24850, 490, 215000, 1340000, 460, 65),
(2024, 6, 24892, 493, 220000, 1370000, 465, 65),
(2024, 7, 24920, 496, 225000, 1400000, 470, 70),
(2024, 8, 24950, 499, 230000, 1430000, 475, 70),
(2024, 9, 24980, 502, 235000, 1460000, 480, 70),
(2024, 10, 25010, 505, 240000, 1490000, 485, 75),
(2024, 11, 25040, 508, 245000, 1520000, 490, 75),
(2024, 12, 25070, 511, 250000, 1550000, 495, 75);

-- 테이블에 RLS 활성화 (공개 데이터이므로 모든 사용자가 읽기 가능)
ALTER TABLE public.monthly_stats ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능하도록 정책 생성
CREATE POLICY "Anyone can view monthly stats" 
  ON public.monthly_stats 
  FOR SELECT 
  TO public 
  USING (true);
