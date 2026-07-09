import "dotenv/config";
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import { MercadoPagoConfig, Preference } from "mercadopago";

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://sve-saas.vercel.app",
  "https://sve.informespsicologicos.com"
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    }
  })
);

app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

const mpClient = process.env.MERCADOPAGO_ACCESS_TOKEN
  ? new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
    })
  : null;

const plans = {
  professional: {
    title: "SVE Plan Profesional",
    price: 19900,
    description: "Hasta 50 documentos mensuales"
  },
  clinic: {
    title: "SVE Plan Consultorio",
    price: 39900,
    description: "Hasta 200 documentos mensuales"
  },
  enterprise: {
    title: "SVE Plan Institucional",
    price: 89900,
    description: "Hasta 1000 documentos mensuales"
  }
};

function calculateAge(birthDate) {
  if (!birthDate) return "";

  const birth = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  const month = today.getMonth() - birth.getMonth();

  if (
    month < 0 ||
    (month === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
}

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "SVE API"
  });
});

app.get("/api/certificates/:code", async (req, res) => {
  const code = String(req.params.code || "").toUpperCase();

  if (!/^CERT-\d{4}-\d{3}$/.test(code)) {
    return res.status(400).json({
      error: "Formato de código inválido."
    });
  }

  const { data, error } = await supabase
    .from("certificates")
    .select(
      "code,status,issuer,issued_at,document_url,holder_name,created_at"
    )
    .eq("code", code)
    .single();

  if (error || !data) {
    return res.status(404).json({
      error: "Documento no encontrado."
    });
  }

  res.json({
    certificate: data
  });
});app.post("/api/validate", async (req, res) => {
  const code = String(req.body.code || "").trim().toUpperCase();

  /*
   * ==========================================================
   * NUEVO SISTEMA (documents)
   * ==========================================================
   */

  const { data: document, error: documentError } = await supabase
    .from("documents")
    .select(`
      *,
      patient:patients(*),
      professional:professionals(*)
    `)
    .eq("public_code", code)
    .maybeSingle();

  if (!documentError && document) {

    const patient = document.patient;
    const professional = document.professional;

    return res.json({

      valid: true,

      code: document.public_code,

      legacyCode: null,

      status: document.status,

      issuer:
        professional?.full_name ||
        "",

      issuedAt: document.issued_at,

      documentUrl: `/d/${document.public_code}`,

      professional: professional
        ? {
            id: professional.id,
            fullName: professional.full_name,
            profession: professional.profession,
            licenseNumber: professional.license_number,
            specialty: professional.specialty,
            email: professional.email,
            phone: professional.phone,
            website: professional.website,
            logoUrl: professional.logo_url,
            signatureUrl: professional.signature_url
          }
        : null,

      patient: patient
        ? {
            fullName: patient.full_name,
            dni: patient.dni,
            birthDate: patient.birth_date,
            age: calculateAge(patient.birth_date)
          }
        : null,

      document: {
        type: document.document_type,
        diagnosis: document.diagnosis,
        treatment: document.treatment,
        observations: document.observations,
        licenseFrom: document.license_from,
        licenseTo: document.license_to,
        body: ""
      }

    });

  }

  /*
   * ==========================================================
   * SISTEMA ANTERIOR (certificates)
   * ==========================================================
   */

  const { data, error } = await supabase
    .from("certificates")
    .select(`
      *,
      professional:professionals(
        id,
        full_name,
        profession,
        license_number,
        specialty,
        email,
        phone,
        website,
        logo_url,
        signature_url
      )
    `)
    .or(`public_code.eq.${code},code.eq.${code}`)
    .maybeSingle();

  if (error || !data) {

    return res.json({

      valid: false,

      message: "Documento no encontrado."

    });

  }

  return res.json({

    valid: true,

    code: data.public_code || data.code,

    legacyCode: data.code,

    status: data.status,

    issuer: data.issuer,

    issuedAt: data.issued_at,

    documentUrl: data.document_url,    professional: data.professional
      ? {
          id: data.professional.id,
          fullName: data.professional.full_name,
          profession: data.professional.profession,
          licenseNumber: data.professional.license_number,
          specialty: data.professional.specialty,
          email: data.professional.email,
          phone: data.professional.phone,
          website: data.professional.website,
          logoUrl: data.professional.logo_url,
          signatureUrl: data.professional.signature_url
        }
      : null,

    patient: {
      fullName: data.patient_full_name || data.holder_name || "",
      dni: data.patient_dni || "",
      birthDate: data.patient_birth_date || "",
      age: data.patient_age || ""
    },

    document: {
      type: data.document_type || "",
      diagnosis: data.diagnosis || "",
      treatment: data.treatment || "",
      licenseFrom: data.license_from || "",
      licenseTo: data.license_to || "",
      body: data.document_body || "",
      observations: data.observations || ""
    }

  });

});

app.post("/api/payments/checkout", async (req, res) => {

  const { planId } = req.body;

  const plan = plans[planId];

  if (!plan) {

    return res.status(400).json({
      error: "Plan inválido."
    });

  }

  if (!mpClient) {

    return res.status(501).json({
      error:
        "Mercado Pago no está configurado. Cargue MERCADOPAGO_ACCESS_TOKEN en el backend."
    });

  }

  try {

    const preference = new Preference(mpClient);

    const result = await preference.create({

      body: {

        items: [
          {
            title: plan.title,
            description: plan.description,
            quantity: 1,
            currency_id: "ARS",
            unit_price: plan.price
          }
        ],

        back_urls: {
          success: process.env.MERCADOPAGO_SUCCESS_URL,
          failure: process.env.MERCADOPAGO_FAILURE_URL,
          pending: process.env.MERCADOPAGO_PENDING_URL
        },

        auto_return: "approved",

        metadata: {
          plan_id: planId
        }

      }

    });

    res.json({
      init_point: result.init_point,
      id: result.id
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "No se pudo crear el checkout."
    });

  }

});

app.listen(PORT, () => {
  console.log(`SVE API running on port ${PORT}`);
});

