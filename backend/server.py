from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend configuration
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
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

class Appointment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    company: Optional[str] = None
    date: str
    time: str
    service: str
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AppointmentCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    company: Optional[str] = None
    date: str
    time: str
    service: str
    notes: Optional[str] = None


# Routes
@api_router.get("/")
async def root():
    return {"message": "Vegsoft Solutions API"}


@api_router.post("/contact", response_model=ContactResponse)
async def submit_contact(form: ContactForm):
    """Submit contact form and send email notification"""
    contact_id = str(uuid.uuid4())
    
    # Save to database
    doc = {
        "id": contact_id,
        "name": form.name,
        "email": form.email,
        "phone": form.phone,
        "company": form.company,
        "message": form.message,
        "service": form.service,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.contacts.insert_one(doc)
    
    # Send email notification
    if resend.api_key:
        try:
            html_content = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #00DC82;">Nuevo Contacto - Vegsoft Solutions</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Nombre:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">{form.name}</td></tr>
                    <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">{form.email}</td></tr>
                    <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">{form.phone or 'No proporcionado'}</td></tr>
                    <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Empresa:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">{form.company or 'No proporcionado'}</td></tr>
                    <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Servicio:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">{form.service or 'No especificado'}</td></tr>
                </table>
                <h3 style="color: #333; margin-top: 20px;">Mensaje:</h3>
                <p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">{form.message}</p>
            </div>
            """
            
            params = {
                "from": SENDER_EMAIL,
                "to": [CONTACT_EMAIL],
                "subject": f"Nuevo Contacto: {form.name} - Vegsoft Solutions",
                "html": html_content
            }
            
            await asyncio.to_thread(resend.Emails.send, params)
            logger.info(f"Email sent for contact {contact_id}")
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
    
    return ContactResponse(
        id=contact_id,
        status="success",
        message="Mensaje recibido correctamente. Nos pondremos en contacto pronto."
    )


@api_router.post("/appointments", response_model=Appointment)
async def create_appointment(appointment: AppointmentCreate):
    """Create a new appointment"""
    apt = Appointment(**appointment.model_dump())
    
    # Save to database
    doc = apt.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.appointments.insert_one(doc)
    
    # Send email notification
    if resend.api_key:
        try:
            html_content = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #00DC82;">Nueva Cita Agendada - Vegsoft Solutions</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Nombre:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">{apt.name}</td></tr>
                    <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">{apt.email}</td></tr>
                    <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">{apt.phone}</td></tr>
                    <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Empresa:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">{apt.company or 'No proporcionado'}</td></tr>
                    <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Fecha:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">{apt.date}</td></tr>
                    <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Hora:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">{apt.time}</td></tr>
                    <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Servicio:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">{apt.service}</td></tr>
                </table>
                {f'<h3 style="color: #333; margin-top: 20px;">Notas:</h3><p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">{apt.notes}</p>' if apt.notes else ''}
            </div>
            """
            
            params = {
                "from": SENDER_EMAIL,
                "to": [CONTACT_EMAIL],
                "subject": f"Nueva Cita: {apt.name} - {apt.date} {apt.time}",
                "html": html_content
            }
            
            await asyncio.to_thread(resend.Emails.send, params)
            logger.info(f"Email sent for appointment {apt.id}")
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
    
    return apt


@api_router.get("/appointments/available-times")
async def get_available_times(date: str):
    """Get available time slots for a specific date"""
    # Get booked times for the date
    booked = await db.appointments.find(
        {"date": date}, 
        {"_id": 0, "time": 1}
    ).to_list(100)
    booked_times = [b["time"] for b in booked]
    
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
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
