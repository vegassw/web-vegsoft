from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from google.cloud import firestore
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request as GoogleRequest
from googleapiclient.discovery import build
import os
import logging
import requests
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
import uuid
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Firestore connection - uses Application Default Credentials (ADC)
# In Cloud Run, ADC automatically uses the service account assigned to the service
PROJECT_ID = os.environ.get('GOOGLE_CLOUD_PROJECT', 'vegsoft-solutions-prod')
db = firestore.Client(project=PROJECT_ID, database='vegsoft-site')

# Google OAuth configuration
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', '')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET', '')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://vegsoft-solutions-prod.web.app')
BACKEND_URL = os.environ.get('BACKEND_URL', '')
REDIRECT_URI = f"{BACKEND_URL}/api/oauth/calendar/callback" if BACKEND_URL else ''

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


# Helper function to get Google Calendar credentials
async def get_calendar_credentials():
    """Get stored Google Calendar credentials for the business owner"""
    doc = db.collection('settings').document('google_calendar').get()
    if not doc.exists:
        return None
    
    data = doc.to_dict()
    tokens = data.get('tokens')
    if not tokens:
        return None
    
    creds = Credentials(
        token=tokens.get('access_token'),
        refresh_token=tokens.get('refresh_token'),
        token_uri='https://oauth2.googleapis.com/token',
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET
    )
    
    # Refresh if expired
    if creds.expired and creds.refresh_token:
        creds.refresh(GoogleRequest())
        # Update stored tokens
        db.collection('settings').document('google_calendar').update({
            'tokens.access_token': creds.token
        })
    
    return creds


async def create_calendar_event(appointment: dict) -> Optional[str]:
    """Create a Google Calendar event for the appointment"""
    try:
        creds = await get_calendar_credentials()
        if not creds:
            logger.warning("No Google Calendar credentials configured")
            return None
        
        service = build('calendar', 'v3', credentials=creds)
        
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
        
        created_event = service.events().insert(calendarId='primary', body=event).execute()
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


# Google Calendar OAuth Routes
@api_router.get("/oauth/calendar/login")
async def calendar_oauth_login():
    """Start OAuth flow to connect Google Calendar"""
    if not GOOGLE_CLIENT_ID or not REDIRECT_URI:
        raise HTTPException(status_code=500, detail="OAuth not configured")
    
    scopes = [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/userinfo.email'
    ]
    
    auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={GOOGLE_CLIENT_ID}&"
        f"redirect_uri={REDIRECT_URI}&"
        f"response_type=code&"
        f"scope={' '.join(scopes)}&"
        f"access_type=offline&"
        f"prompt=consent"
    )
    
    return {"authorization_url": auth_url}


@api_router.get("/oauth/calendar/callback")
async def calendar_oauth_callback(code: str):
    """Handle OAuth callback and store tokens"""
    try:
        # Exchange code for tokens
        token_response = requests.post(
            'https://oauth2.googleapis.com/token',
            data={
                'code': code,
                'client_id': GOOGLE_CLIENT_ID,
                'client_secret': GOOGLE_CLIENT_SECRET,
                'redirect_uri': REDIRECT_URI,
                'grant_type': 'authorization_code'
            }
        ).json()
        
        if 'error' in token_response:
            raise HTTPException(status_code=400, detail=token_response['error_description'])
        
        # Get user email
        user_info = requests.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            headers={'Authorization': f"Bearer {token_response['access_token']}"}
        ).json()
        
        # Store tokens in Firestore
        db.collection('settings').document('google_calendar').set({
            'tokens': {
                'access_token': token_response['access_token'],
                'refresh_token': token_response.get('refresh_token'),
                'token_uri': 'https://oauth2.googleapis.com/token',
            },
            'email': user_info.get('email'),
            'connected_at': datetime.now(timezone.utc).isoformat()
        })
        
        logger.info(f"Google Calendar connected for: {user_info.get('email')}")
        
        # Redirect to frontend with success
        return RedirectResponse(url=f"{FRONTEND_URL}?calendar_connected=true")
    
    except Exception as e:
        logger.error(f"OAuth callback error: {str(e)}")
        return RedirectResponse(url=f"{FRONTEND_URL}?calendar_error=true")


@api_router.get("/oauth/calendar/status")
async def calendar_status():
    """Check if Google Calendar is connected"""
    doc = db.collection('settings').document('google_calendar').get()
    if doc.exists:
        data = doc.to_dict()
        return {
            "connected": True,
            "email": data.get('email'),
            "connected_at": data.get('connected_at')
        }
    return {"connected": False}


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
