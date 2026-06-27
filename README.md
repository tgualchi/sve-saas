# SVE - Sistema de Validación Electrónica

Proyecto SaaS inicial para validación electrónica de documentos profesionales.

## Arquitectura

- `frontend/`: aplicación web pública y panel inicial.
- `backend/`: API segura para certificados, usuarios y pagos.
- `database/`: esquema SQL para Supabase/PostgreSQL.
- `docs/`: guía de despliegue.

## Stack propuesto

- Frontend: React + Vite
- Backend: Node.js + Express
- Base de datos: Supabase / PostgreSQL
- Pagos: Mercado Pago
- Hosting frontend: Vercel
- Hosting backend: Render
- Dominio: validacion.informespsicologicos.com

## Flujo inicial

1. Usuario valida un código tipo `CERT-2026-045`.
2. El frontend consulta al backend.
3. El backend busca el certificado en Supabase.
4. Si existe y está válido, devuelve estado y URL pública del documento.
5. El usuario puede abrir el documento original.
6. Planes y pagos quedan preparados para integración con Mercado Pago.

## Importante

No subir claves privadas a GitHub.

Usar `.env.example` como plantilla y cargar las claves reales en Vercel/Render.
