-- SVE - Supabase/PostgreSQL schema

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  plan text default 'professional',
  created_at timestamptz default now()
);

create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete set null,
  code text unique not null,
  status text not null default 'valid' check (status in ('valid','revoked','expired','review')),
  issuer text not null default 'InformesPsicologicos.com',
  holder_name text,
  issued_at date,
  document_url text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_certificates_code on certificates(code);
create index if not exists idx_certificates_status on certificates(status);

insert into organizations (name, email, phone, plan)
values ('InformesPsicologicos.com', 'sistemadevalidacionelectronica@gmail.com', '+54 9 11 2402-8499', 'clinic')
on conflict do nothing;

insert into certificates (code, status, issuer, holder_name, issued_at, document_url)
values
('CERT-2026-045', 'valid', 'InformesPsicologicos.com', 'Documento de prueba', '2026-06-27', 'https://www.informespsicologicos.com/cert-2026-045')
on conflict (code) do update
set document_url = excluded.document_url;
