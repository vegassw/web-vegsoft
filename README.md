# Vegsoft Solutions

Sitio web profesional de Vegsoft Solutions - Empresa de desarrollo de software y consultoría tecnológica.

## Tech Stack

- **Frontend:** React + Tailwind CSS + Shadcn/UI
- **Backend:** FastAPI (Python)
- **Database:** Google Firestore
- **Hosting:** Google Cloud Run
- **Calendar:** Google Calendar API

## Características

- Landing page profesional con tema oscuro
- Selector de idioma (Español/Inglés)
- Formulario de contacto
- Sistema de agendamiento de citas con integración a Google Calendar
- WhatsApp flotante
- Diseño responsive

## Servicios

- Desarrollo de Software
- Sitios Web
- Apps Móviles
- E-commerce
- IA & Automatización
- Consultoría Tech
- QA & Testing
- DevOps & Cloud
- Diseño UX/UI
- Data & Analytics
- Ciberseguridad
- Soporte & Mantenimiento

## Despliegue

El proyecto se despliega automáticamente en Google Cloud Run cuando se hace push a la rama `main`.

### Variables de entorno necesarias en Cloud Build:

- `GOOGLE_CLOUD_PROJECT`: ID del proyecto de GCP
- `GOOGLE_CLIENT_ID`: Client ID de OAuth para Google Calendar
- `GOOGLE_CLIENT_SECRET`: Client Secret de OAuth
- `BACKEND_URL`: URL del servicio de Cloud Run
- `FRONTEND_URL`: URL del frontend (misma que BACKEND_URL)

## Desarrollo local

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8001

# Frontend
cd frontend
yarn install
yarn start
```

## Contacto

- **Email:** Douglas.vegas@vegsoftsolutions.com
- **WhatsApp:** +56 947 127 116

---

© 2026 Vegsoft Solutions. Todos los derechos reservados.
