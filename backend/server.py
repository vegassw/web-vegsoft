from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid
from datetime import datetime, timezone, timedelta
import urllib.parse

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging first
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Environment variables
PROJECT_ID = os.environ.get('GOOGLE_CLOUD_PROJECT', 'vegsoft-solutions-prod')
CALENDAR_ID = os.environ.get('CALENDAR_ID', 'primary')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://vegsoft-solutions-307650209341.us-central1.run.app')
CONTACT_EMAIL = "Douglas.vegas@vegsoftsolutions.com"
WHATSAPP_NUMBER = "56947127116"

# Lazy initialization for Firestore
_db = None

def get_db():
    """Lazy initialization of Firestore client"""
    global _db
    if _db is None:
        try:
            from google.cloud import firestore
            _db = firestore.Client(project=PROJECT_ID, database='vegsoft-site')
            logger.info("Firestore client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Firestore: {str(e)}")
            raise
    return _db

# Lazy initialization for Calendar service
def get_calendar_service():
    """Get Google Calendar service using Application Default Credentials"""
    try:
        import google.auth
        from googleapiclient.discovery import build
        credentials, project = google.auth.default(
            scopes=['https://www.googleapis.com/auth/calendar']
        )
        service = build('calendar', 'v3', credentials=credentials)
        return service
    except Exception as e:
        logger.error(f"Failed to initialize Calendar service: {str(e)}")
        return None


def generate_whatsapp_notification_url(appointment: dict) -> str:
    """Generate a WhatsApp click-to-chat URL with appointment details"""
    message = f"""🗓️ *NUEVA CITA AGENDADA*

👤 *Cliente:* {appointment['name']}
📧 *Email:* {appointment['email']}
📱 *Teléfono:* {appointment['phone']}
🏢 *Empresa:* {appointment.get('company') or 'No especificada'}
📅 *Fecha:* {appointment['date']}
⏰ *Hora:* {appointment['time']}
💼 *Servicio:* {appointment['service']}
📝 *Notas:* {appointment.get('notes') or 'Sin notas'}

_Cita registrada automáticamente desde el sitio web_"""
    
    encoded_message = urllib.parse.quote(message)
    return f"https://wa.me/{WHATSAPP_NUMBER}?text={encoded_message}"
# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class ContactForm(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    message: str
    service: Optional[str] = None

class ContactResponse(BaseModel):
    id: str
    status: str
    message: str

class AppointmentCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    company: Optional[str] = None
    date: str
    time: str
    service: str
    notes: Optional[str] = None

class AppointmentResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    company: Optional[str]
    date: str
    time: str
    service: str
    notes: Optional[str]
    created_at: str
    calendar_event_id: Optional[str] = None
    whatsapp_notification_url: Optional[str] = None


async def create_calendar_event(appointment: dict) -> Optional[str]:
    """Create a Google Calendar event for the appointment using service account"""
    try:
        service = get_calendar_service()
        if not service:
            logger.warning("Could not initialize Google Calendar service")
            return None
        
        # Parse date and time
        date_str = appointment['date']
        time_str = appointment['time']
        start_dt = datetime.fromisoformat(f"{date_str}T{time_str}:00")
        end_dt = start_dt + timedelta(minutes=30)  # 30 minutes duration
        
        event = {
            'summary': f"Cita: {appointment['name']} - {appointment['service']}",
            'description': f"""
Nombre: {appointment['name']}
Email: {appointment['email']}
Teléfono: {appointment['phone']}
Empresa: {appointment.get('company', 'No especificada')}
Servicio: {appointment['service']}
Notas: {appointment.get('notes', 'Sin notas')}
            """.strip(),
            'start': {
                'dateTime': start_dt.isoformat(),
                'timeZone': 'America/Santiago',
            },
            'end': {
                'dateTime': end_dt.isoformat(),
                'timeZone': 'America/Santiago',
            },
            'conferenceData': {
                'createRequest': {
                    'requestId': f"vegsoft-{appointment.get('id', 'meet')}",
                    'conferenceSolutionKey': {'type': 'hangoutsMeet'}
                }
            },
            'reminders': {
                'useDefault': False,
                'overrides': [
                    {'method': 'email', 'minutes': 24 * 60},
                    {'method': 'popup', 'minutes': 10},
                ],
            },
        }
        
        # Use CALENDAR_ID - this should be the email of the calendar owner
        # who has shared their calendar with the service account
        # conferenceDataVersion=1 enables Google Meet creation
        created_event = service.events().insert(
            calendarId=CALENDAR_ID, 
            body=event,
            conferenceDataVersion=1
        ).execute()
        logger.info(f"Calendar event created: {created_event.get('id')}")
        return created_event.get('id')
    
    except Exception as e:
        logger.error(f"Failed to create calendar event: {str(e)}")
        return None


# Routes
@api_router.get("/")
async def root():
    return {"message": "Vegsoft Solutions API", "status": "running"}


@api_router.get("/health")
async def health():
    return {"status": "healthy", "database": "firestore"}


# Calendar status endpoint (simplified - no OAuth needed)
@api_router.get("/calendar/status")
async def calendar_status():
    """Check if Google Calendar integration is configured"""
    service = get_calendar_service()
    if service:
        return {
            "configured": True,
            "message": "Calendar integration is active via service account",
            "calendar_id": CALENDAR_ID
        }
    return {"configured": False, "message": "Calendar service not available"}


@api_router.post("/contact", response_model=ContactResponse)
async def submit_contact(form: ContactForm):
    """Submit contact form"""
    contact_id = str(uuid.uuid4())
    
    # Save to Firestore
    doc_data = {
        "id": contact_id,
        "name": form.name,
        "email": form.email,
        "phone": form.phone,
        "company": form.company,
        "message": form.message,
        "service": form.service,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "new"
    }
    
    try:
        db = get_db()
        db.collection('contacts').document(contact_id).set(doc_data)
        logger.info(f"Contact saved: {contact_id}")
    except Exception as e:
        logger.error(f"Failed to save contact: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al guardar el mensaje")
    
    return ContactResponse(
        id=contact_id,
        status="success",
        message="Mensaje recibido correctamente. Nos pondremos en contacto pronto."
    )


@api_router.post("/appointments", response_model=AppointmentResponse)
async def create_appointment(appointment: AppointmentCreate):
    """Create a new appointment"""
    apt_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc).isoformat()
    
    # Prepare appointment data
    apt_data = {
        "id": apt_id,
        "name": appointment.name,
        "email": appointment.email,
        "phone": appointment.phone,
        "company": appointment.company,
        "date": appointment.date,
        "time": appointment.time,
        "service": appointment.service,
        "notes": appointment.notes,
        "created_at": created_at,
        "status": "confirmed"
    }
    
    # Create Google Calendar event (don't fail if calendar fails)
    calendar_event_id = None
    try:
        calendar_event_id = await create_calendar_event(apt_data)
        if calendar_event_id:
            apt_data["calendar_event_id"] = calendar_event_id
    except Exception as e:
        logger.error(f"Calendar event creation failed: {str(e)}")
    
    # Generate WhatsApp notification URL
    whatsapp_url = generate_whatsapp_notification_url(apt_data)
    apt_data["whatsapp_notification_url"] = whatsapp_url
    
    # Save to Firestore
    try:
        db = get_db()
        db.collection('appointments').document(apt_id).set(apt_data)
        logger.info(f"Appointment created: {apt_id}, calendar_event: {calendar_event_id}")
    except Exception as e:
        logger.error(f"Failed to save appointment: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al guardar la cita")
    
    return AppointmentResponse(
        id=apt_id,
        name=appointment.name,
        email=appointment.email,
        phone=appointment.phone,
        company=appointment.company,
        date=appointment.date,
        time=appointment.time,
        service=appointment.service,
        notes=appointment.notes,
        created_at=created_at,
        calendar_event_id=calendar_event_id,
        whatsapp_notification_url=whatsapp_url
    )


@api_router.get("/appointments/available-times")
async def get_available_times(date: str):
    """Get available time slots for a specific date"""
    try:
        db = get_db()
        # Get booked appointments for the date
        appointments = db.collection('appointments').where('date', '==', date).stream()
        booked_times = [apt.to_dict().get('time') for apt in appointments]
    except Exception as e:
        logger.error(f"Failed to get appointments: {str(e)}")
        booked_times = []
    
    # Define all possible time slots
    all_times = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "14:00", "14:30", "15:00", "15:30", "16:00",
        "16:30", "17:00", "17:30"
    ]
    
    # Return available times
    available = [t for t in all_times if t not in booked_times]
    return {"date": date, "available_times": available}


@api_router.get("/admin/appointments")
async def get_all_appointments():
    """Get all appointments (admin endpoint)"""
    try:
        db = get_db()
        appointments = db.collection('appointments').order_by('created_at', direction='DESCENDING').limit(50).stream()
        result = []
        for apt in appointments:
            data = apt.to_dict()
            result.append(data)
        return {"appointments": result, "count": len(result)}
    except Exception as e:
        logger.error(f"Failed to get appointments: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al obtener citas")


@api_router.get("/admin/contacts")
async def get_all_contacts():
    """Get all contact messages (admin endpoint)"""
    try:
        db = get_db()
        contacts = db.collection('contacts').order_by('created_at', direction='DESCENDING').limit(50).stream()
        result = []
        for contact in contacts:
            data = contact.to_dict()
            result.append(data)
        return {"contacts": result, "count": len(result)}
    except Exception as e:
        logger.error(f"Failed to get contacts: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al obtener mensajes")


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
