-- Supabase schema for Uji Coba TKA SD
-- Apply this in Supabase Dashboard > SQL Editor.
-- IMPORTANT: This starter setup stores submitted scores. It is not an anti-cheating
-- system; client-side answer keys and scores can be inspected/modified by users.

create extension if not exists pgcrypto;

create table if not exists public.exam_results (
  id uuid primary key default gen_random_uuid(),
  student_name text not null check (char_length(trim(student_name)) between 1 and 120),
  nisn text not null check (nisn ~ '^[0-9]{10}$'),
  school_name text not null default 'UPT SD Negeri Prunggahan Kulon 1',
  exam_code text not null default 'TKA-2027',
  score numeric(5,2) not null check (score >= 0 and score <= 100),
  correct_count integer not null check (correct_count >= 0),
  total_questions integer not null check (total_questions > 0),
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  submitted_at timestamptz not null default now()
);

create index if not exists exam_results_submitted_at_idx
  on public.exam_results (submitted_at desc);
create index if not exists exam_results_nisn_idx
  on public.exam_results (nisn);

alter table public.exam_results enable row level security;

-- Students may submit a result, but anonymous users cannot read results.
drop policy if exists "anon_submit_exam_result" on public.exam_results;
create policy "anon_submit_exam_result"
on public.exam_results for insert to anon
with check (
  char_length(trim(student_name)) between 1 and 120
  and nisn ~ '^[0-9]{10}$'
  and score between 0 and 100
  and correct_count >= 0
  and total_questions > 0
);

-- Teacher access is intentionally not opened yet.
-- After creating teacher accounts, add a teacher allowlist and a SELECT policy
-- restricted to those authenticated user IDs (instructions in SUPABASE_SETUP.md).
