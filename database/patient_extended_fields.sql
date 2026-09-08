-- Ejecutar una sola vez en Supabase > SQL Editor antes de desplegar SVE v1.2.3.

alter table public.patients
  add column if not exists sex text,
  add column if not exists health_coverage text,
  add column if not exists health_plan text,
  add column if not exists credential_number text;

create policy "professionals_update_own_patients"
on public.patients
for update
to authenticated
using (
  professional_id in (
    select id from public.professionals where auth_user_id = auth.uid()
  )
)
with check (
  professional_id in (
    select id from public.professionals where auth_user_id = auth.uid()
  )
);
