from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from google.cloud import firestore
from googleapiclient.discovery import build
import google.auth
import os
import logging
from pathlib import Path
from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Firestore connection - uses Application Default Credentials (ADC)
# In Cloud Run, ADC automatically uses the service account assigned to the service
# Last updated: 2026-03-13
PROJECT_ID = os.environ.get('GOOGLE_CLOUD_PROJECT', 'vegsoft-solutions-prod')
db = firestore.Client(project=PROJECT_ID, database='vegsoft-site')

# Calendar configuration - uses service account
# The calendar owner must share their calendar with the service account email
CALENDAR_ID = os.environ.get('CALENDAR_ID', 'primary')  # Can be set to specific calendar email
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://vegsoft-solutions-prod.run.app')

# Contact email
CONTACT_EMAIL = "Douglas.vegas@vegsoftsolutions.com"

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


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


# Helper function to get Google Calendar service using service account
def get_calendar_service():
    """Get Google Calendar service using Application Default Credentials (service account)"""
    try:
        # Use ADC - in Cloud Run this automatically uses the assigned service account
        credentials, project = google.auth.default(
            scopes=['https://www.googleapis.com/auth/calendar']
        )
        service = build('calendar', 'v3', credentials=credentials)
        return service
    except Exception as e:
        logger.error(f"Failed to initialize Calendar service: {str(e)}")
        return None


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
        end_dt = start_dt + timedelta(hours=1)
        
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
            'reminders': {
                'useDefault': False,
                'overrides': [
                    {'method': 'email', 'minutes': 24 * 60},
                    {'method': 'popup', 'minutes': 30},
                ],
            },
        }
        
        # Use CALENDAR_ID - this should be the email of the calendar owner
        # who has shared their calendar with the service account
        created_event = service.events().insert(calendarId=CALENDAR_ID, body=event).execute()
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
    
    db.collection('contacts').document(contact_id).set(doc_data)
    logger.info(f"Contact saved: {contact_id}")
    
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
    
    # Create Google Calendar event
    calendar_event_id = await create_calendar_event(apt_data)
    if calendar_event_id:
        apt_data["calendar_event_id"] = calendar_event_id
    
    # Save to Firestore
    db.collection('appointments').document(apt_id).set(apt_data)
    logger.info(f"Appointment created: {apt_id}, calendar_event: {calendar_event_id}")
    
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
        calendar_event_id=calendar_event_id
    )


@api_router.get("/appointments/available-times")
async def get_available_times(date: str):
    """Get available time slots for a specific date"""
    # Get booked appointments for the date
    appointments = db.collection('appointments').where('date', '==', date).stream()
    booked_times = [apt.to_dict().get('time') for apt in appointments]
    
    # Define all possible time slots
    all_times = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "14:00", "14:30", "15:00", "15:30", "16:00",
        "16:30", "17:00", "17:30"
    ]
    
    # Return available times
    available = [t for t in all_times if t not in booked_times]
    return {"date": date, "available_times": available}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
