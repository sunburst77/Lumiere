-- ══════════════════════════════════════════════════════════════
--  index.html 하단 상담 신청 폼 → Supabase 저장
--  SQL Editor에서 실행하세요.
-- ══════════════════════════════════════════════════════════════

create table if not exists public.consult_requests (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  name             text not null,
  phone            text not null,
  agreed_privacy   boolean not null default true,
  source_page      text default 'index',
  event_label      text  -- 이벤트 카드에서 신청 시 이벤트명 (예: "오픈 기념 30% 할인")
);

-- 이미 테이블이 있는 경우에도 컬럼이 없으면 추가
alter table public.consult_requests
  add column if not exists event_label text;

comment on table public.consult_requests is '웹 상담/이벤트 신청';

alter table public.consult_requests enable row level security;

drop policy if exists "Allow anon insert consult_requests" on public.consult_requests;
create policy "Allow anon insert consult_requests"
  on public.consult_requests
  for insert
  to anon, authenticated
  with check (true);

-- 대시보드에서만 조회·수정하세요(anon 읽기 비활성화 = 개인정보 노출 최소화)
-- 필요 시 authenticated 전용 select 정책을 별도로 추가하면 됩니다.

grant insert on table public.consult_requests to anon, authenticated;
