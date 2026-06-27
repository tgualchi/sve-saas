# Despliegue SVE

## 1. Subir a GitHub

1. Descomprimir el ZIP.
2. Crear un repositorio en GitHub, por ejemplo `sve-saas`.
3. Subir todo el contenido.

## 2. Crear Supabase

1. Entrar a Supabase.
2. Crear proyecto nuevo.
3. Ir a SQL Editor.
4. Ejecutar `database/schema.sql`.
5. Copiar:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

La `SERVICE_ROLE_KEY` es privada. Solo va en Render, nunca en GitHub ni frontend.

## 3. Backend en Render

1. Crear nuevo Web Service.
2. Conectar el repo.
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Variables:
   - `PORT=4000`
   - `FRONTEND_URL=https://validacion.informespsicologicos.com`
   - `SUPABASE_URL=...`
   - `SUPABASE_SERVICE_ROLE_KEY=...`
   - `MERCADOPAGO_ACCESS_TOKEN=...`

## 4. Frontend en Vercel

1. Crear nuevo proyecto.
2. Conectar el repo.
3. Root directory: `frontend`
4. Framework: Vite
5. Variables:
   - `VITE_API_URL=https://TU-BACKEND.onrender.com`
   - `VITE_PUBLIC_SITE_URL=https://validacion.informespsicologicos.com`
   - `VITE_WHATSAPP_NUMBER=5491124028499`
   - `VITE_CONTACT_EMAIL=sistemadevalidacionelectronica@gmail.com`

## 5. Dominio

En Vercel, agregar:
`validacion.informespsicologicos.com`

En DonWeb, cambiar el CNAME del subdominio a lo que indique Vercel.

## 6. Mercado Pago

Para Checkout Pro real:
- Usar `MERCADOPAGO_ACCESS_TOKEN` solo en Render.
- El frontend llama al backend.
- El backend crea la preferencia de pago.
- Mercado Pago devuelve `init_point`.
- El frontend redirige al checkout.
