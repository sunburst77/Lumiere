-- ══════════════════════════════════════════════════════════════
--  Supabase SQL Editor에서 전체를 한 번에 실행하세요.
--  success-cases.html 페이지의 성공사례 데이터입니다.
-- ══════════════════════════════════════════════════════════════

-- ── 테이블 생성 (없는 경우에만) ───────────────────────────────
create table if not exists public.success_stories (
  id             uuid    primary key default gen_random_uuid(),
  sort_order     int     not null default 0,
  is_featured    boolean not null default false,
  procedure_label text   not null,  -- 성형 종류 필터에 사용
  meta_line      text,
  title          text    not null,
  excerpt        text,
  image_url      text    not null,
  accent_class   text,
  constraint success_stories_accent_class_check check (
    accent_class is null
    or accent_class in ('ph2','ph3','ph4','ph5')
  )
);

comment on table public.success_stories is '성공사례 모아보기 카드 데이터';

-- ── RLS ───────────────────────────────────────────────────────
alter table public.success_stories enable row level security;

drop policy if exists "Allow public read success_stories"  on public.success_stories;
drop policy if exists "Allow service insert success_stories" on public.success_stories;

create policy "Allow public read success_stories"
  on public.success_stories for select
  to anon, authenticated
  using (true);

-- ── 기존 데이터 초기화 후 재삽입 ──────────────────────────────
truncate table public.success_stories restart identity;

insert into public.success_stories
  (sort_order, is_featured, procedure_label, meta_line, title, excerpt, image_url, accent_class)
values
  -- 눈성형 (3건)
  ( 1, true,  '눈성형',   '김루미 원장 · 2025.12.18',
    '자연스러운 인아웃 라인, 3개월 경과 리얼 후기',
    '눈매교정과 앞트임을 함께 진행한 20대 여성 고객님의 3개월 경과 결과를 공유합니다.',
    'review1.png', null),

  ( 5, false, '눈성형',   '김루미 원장 · 2025.10.30',
    '쌍꺼풀 매몰법, 붓기 없이 일상 복귀',
    '자연스럽고 선명한 눈매를 원하는 30대 직장인 고객님의 1개월 경과 리포트.',
    'review5.png', 'ph5'),

  ( 7, false, '눈성형',   '김루미 원장 · 2025.09.25',
    '눈매교정 재수술, 더 자연스럽게',
    '기존 수술 후 좌우 비대칭이 있던 고객님을 재교정하여 균형 잡힌 눈매를 만든 케이스.',
    'review1.png', 'ph3'),

  -- 코성형 (2건)
  ( 2, false, '코성형',   '김루미 원장 · 2025.12.05',
    '콧대 + 코끝 동시 교정, 6개월 결과',
    '콧대 보형물과 코끝 연골 이식을 함께 진행해 전체적인 코 라인을 완성한 사례.',
    'review2.png', 'ph2'),

  ( 6, false, '코재수술', '김루미 원장 · 2025.10.22',
    '구축 코재수술, 6개월 경과 사진 공개',
    '구축으로 단축된 코를 연장하고 자연스러운 모양으로 복원한 심층 케이스 리포트.',
    'review6.png', 'ph2'),

  -- 안면윤곽 (2건)
  ( 3, false, '안면윤곽', '박에르 원장 · 2025.11.28',
    '부드러운 V라인, 6개월 변화',
    '과하지 않게 자연스러운 턱선의 균형을 찾은 케이스 리포트.',
    'review3.png', 'ph3'),

  ( 9, false, '안면윤곽', '박에르 원장 · 2025.09.12',
    '광대축소술, 작고 갸름한 얼굴로',
    '광대뼈를 부드럽게 다듬어 전체 얼굴 비율이 개선된 사례를 공유합니다.',
    'review3.png', 'ph5'),

  -- 지방이식 (2건)
  ( 4, false, '지방이식', '박에르 원장 · 2025.11.14',
    '볼 지방이식, 생기 있는 얼굴형으로',
    '빠진 볼살을 복원하고 동안 인상을 만든 40대 여성 고객님의 3개월 경과.',
    'review4.png', 'ph4'),

  (12, false, '지방이식', '박에르 원장 · 2025.08.05',
    '이마 지방이식, 풍성하고 매끄러운 라인',
    '꺼진 이마를 자연스럽게 채워 달걀형 얼굴로 개선된 20대 후반 고객님 사례.',
    'review6.png', 'ph4'),

  -- 리프팅 (2건)
  ( 8, false, '리프팅',   '박에르 원장 · 2025.10.08',
    '실 리프팅, 자연스럽게 당겨진 탄력',
    '처짐이 시작된 40대 중반 고객님의 실 리프팅 4개월 후 비교 사진과 소감.',
    'review2.png', 'ph3'),

  (10, false, '리프팅',   '박에르 원장 · 2025.08.30',
    '울쎄라 리프팅, 피부 속 당김 효과',
    '울쎄라 시술 후 6개월, 꺼진 볼과 처진 턱선이 개선된 50대 여성 고객님 사례.',
    'review4.png', 'ph2'),

  -- 피부시술 (2건)
  (11, false, '피부시술', '김루미 원장 · 2025.09.25',
    '레이저 토닝으로 맑아진 피부톤',
    '잡티와 색소침착 개선을 위해 레이저 토닝 5회를 진행한 20대 후반 고객님 사례.',
    'review3.png', 'ph4'),

  (13, false, '피부시술', '김루미 원장 · 2025.08.18',
    '아크네 흉터 개선, 3개월 전후 비교',
    '오랜 여드름 흉터를 리줄렌과 프락셀로 집중 관리한 30대 남성 고객님 케이스.',
    'review1.png', 'ph3');

-- sort_order 1→review1.png … 6→review6.png … 7→review1.png 식으로 통일
update public.success_stories
  set image_url = format('review%s.png', mod(sort_order - 1, 6) + 1);
