from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, Body, Form
from pydantic import BaseModel

from app.core.config import settings
from app.services.gemini_service import (
    generate_restaurant_outreach_message,
    generate_call_script,
    parse_restaurant_reply
)
from app.services.twilio_service import (
    send_twilio_whatsapp,
    initiate_twilio_call
)

router = APIRouter(prefix="/restaurants", tags=["Restaurants & AI Outreach"])

# In-memory store of nearby restaurants (using user's phone number: 9829407512)
DEFAULT_PHONE = getattr(settings, "DEFAULT_RESTAURANT_NUMBER", "+919829407512")

RESTAURANTS_DB = [
    {
        "id": "rest-test-live",
        "name": "Live Test Restaurant (Your Phone)",
        "lat": 26.9135,
        "lng": 75.7890,
        "address": "Pilot Testing Ground, Civil Lines, Jaipur",
        "phone": "+919829407512",
        "contact_person": "You (Owner / Test Phone)",
        "distance": "0.4 km",
        "cuisine": "North Indian Kitchen & Bakery",
        "avg_daily_surplus": "50 - 75 meals (Test Batch)",
        "rating": 5.0,
        "status": "Ready to Contact",
        "is_test": True,
        "last_outreach": None,
        "last_reply": None,
        "surplus_data": None
    },
    {
        "id": "rest-1",
        "name": "The Grand Palace Banquet",
        "lat": 26.9124,
        "lng": 75.7873,
        "address": "Plot 42, Civil Lines, Jaipur",
        "phone": "+919829407512",
        "contact_person": "Vikram Singh (Banquet Manager)",
        "distance": "1.2 km",
        "cuisine": "North Indian & Buffet",
        "avg_daily_surplus": "60 - 90 meals",
        "rating": 4.8,
        "status": "Ready to Contact",
        "last_outreach": None,
        "last_reply": None,
        "surplus_data": None
    },
    {
        "id": "rest-2",
        "name": "Haldiram's Sweets & Dining",
        "lat": 26.9160,
        "lng": 75.7925,
        "address": "MI Road, Near Panch Batti, Jaipur",
        "phone": DEFAULT_PHONE,
        "contact_person": "Ramesh Gupta (Store Manager)",
        "distance": "1.8 km",
        "cuisine": "Vegetarian & Bakery",
        "avg_daily_surplus": "40 - 55 meals",
        "rating": 4.6,
        "status": "Ready to Contact",
        "last_outreach": None,
        "last_reply": None,
        "surplus_data": None
    },
    {
        "id": "rest-3",
        "name": "Barbeque Nation",
        "lat": 26.9080,
        "lng": 75.7820,
        "address": "City Mall, Tonk Road, Jaipur",
        "phone": DEFAULT_PHONE,
        "contact_person": "Anil Sharma (F&B Head)",
        "distance": "2.3 km",
        "cuisine": "Buffet & Grill",
        "avg_daily_surplus": "50 - 75 meals",
        "rating": 4.7,
        "status": "Ready to Contact",
        "last_outreach": None,
        "last_reply": None,
        "surplus_data": None
    },
    {
        "id": "rest-4",
        "name": "ITC Rajputana Kitchen",
        "lat": 26.9210,
        "lng": 75.7960,
        "address": "Palace Road, Gopalbari, Jaipur",
        "phone": DEFAULT_PHONE,
        "contact_person": "Chef Manjit (Executive Chef)",
        "distance": "2.9 km",
        "cuisine": "Multi-cuisine Luxury Buffet",
        "avg_daily_surplus": "80 - 120 meals",
        "rating": 4.9,
        "status": "Ready to Contact",
        "last_outreach": None,
        "last_reply": None,
        "surplus_data": None
    },
    {
        "id": "rest-5",
        "name": "Bikanervala Express",
        "lat": 26.9040,
        "lng": 75.7890,
        "address": "C-Scheme, Subhash Marg, Jaipur",
        "phone": DEFAULT_PHONE,
        "contact_person": "Pooja Verma (Ops Lead)",
        "distance": "3.1 km",
        "cuisine": "Fast Food & Confectionery",
        "avg_daily_surplus": "30 - 45 meals",
        "rating": 4.5,
        "status": "Ready to Contact",
        "last_outreach": None,
        "last_reply": None,
        "surplus_data": None
    },
    {
        "id": "rest-6",
        "name": "Chhabra's Pure Veg Kitchen",
        "lat": 26.9110,
        "lng": 75.7990,
        "address": "Raja Park Main Market, Jaipur",
        "phone": DEFAULT_PHONE,
        "contact_person": "Sanjay Chhabra (Owner)",
        "distance": "3.5 km",
        "cuisine": "Pure Veg Thali & Roti",
        "avg_daily_surplus": "35 - 50 meals",
        "rating": 4.7,
        "status": "Ready to Contact",
        "last_outreach": None,
        "last_reply": None,
        "surplus_data": None
    }
]

class ConnectRequest(BaseModel):
    channel: str = "both"  # "whatsapp", "call", "both"
    ngo_name: str = "Green Future Foundation"
    custom_phone: Optional[str] = None
    custom_note: Optional[str] = None

class ReplySimulateRequest(BaseModel):
    reply_text: str = "Namaste! Yes, we have about 45 meal portions of paneer curry & roti packed in clean trays. Can pick up before 3 PM."

@router.get("/nearby")
def get_nearby_restaurants():
    """
    Returns list of nearby restaurants with coordinates, phone, and surplus capacity.
    """
    return {
        "success": True,
        "count": len(RESTAURANTS_DB),
        "ngo_center": {
            "name": "Green Future Foundation",
            "lat": 26.9140,
            "lng": 75.7880,
            "address": "Jaipur NGO Hub"
        },
        "restaurants": RESTAURANTS_DB
    }

@router.post("/{restaurant_id}/connect")
async def connect_restaurant(restaurant_id: str, payload: ConnectRequest):
    """
    Single-click AI outreach: Generates personalized Gemini text and dispatches via Twilio WhatsApp & Call.
    """
    restaurant = next((r for r in RESTAURANTS_DB if r["id"] == restaurant_id), None)
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    target_phone = payload.custom_phone or restaurant.get("phone") or DEFAULT_PHONE

    # 1. Generate AI message with Gemini
    ai_message = await generate_restaurant_outreach_message(
        restaurant_name=restaurant["name"],
        ngo_name=payload.ngo_name,
        location=f"within {restaurant['distance']}",
        food_category_hint=restaurant["cuisine"]
    )

    whatsapp_result = None
    call_result = None

    # 2. Dispatch WhatsApp
    if payload.channel in ["whatsapp", "both"]:
        whatsapp_result = await send_twilio_whatsapp(
            to_number=target_phone,
            message=ai_message
        )

    # 3. Dispatch Voice Call
    if payload.channel in ["call", "both"]:
        voice_script = await generate_call_script(
            restaurant_name=restaurant["name"],
            ngo_name=payload.ngo_name
        )
        call_result = await initiate_twilio_call(
            to_number=target_phone,
            voice_script=voice_script
        )

    # Update restaurant record
    restaurant["status"] = "Outreach Sent"
    restaurant["last_outreach"] = {
        "timestamp": datetime.now().isoformat(),
        "channel": payload.channel,
        "target_phone": target_phone,
        "message": ai_message,
        "whatsapp_result": whatsapp_result,
        "call_result": call_result
    }

    return {
        "success": True,
        "message": f"AI Outreach dispatched to {restaurant['name']}",
        "restaurant_id": restaurant_id,
        "restaurant_name": restaurant["name"],
        "target_phone": target_phone,
        "channel": payload.channel,
        "ai_generated_message": ai_message,
        "whatsapp_status": whatsapp_result,
        "call_status": call_result,
        "updated_status": restaurant["status"]
    }

@router.post("/{restaurant_id}/simulate-reply")
async def simulate_restaurant_reply(restaurant_id: str, payload: ReplySimulateRequest):
    """
    Simulates the restaurant manager replying on WhatsApp. Gemini parses the reply.
    """
    restaurant = next((r for r in RESTAURANTS_DB if r["id"] == restaurant_id), None)
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    parsed = await parse_restaurant_reply(payload.reply_text)

    if parsed["has_surplus"]:
        now_iso = datetime.now().isoformat()
        restaurant["status"] = "Surplus Confirmed"
        restaurant["surplus_data"] = {
            "confirmed_at": now_iso,
            "donor_submitted_at": now_iso,
            "reply_text": payload.reply_text,
            "parsed": parsed
        }
    else:
        restaurant["status"] = "No Surplus Today"

    restaurant["last_reply"] = {
        "timestamp": datetime.now().isoformat(),
        "text": payload.reply_text,
        "parsed": parsed
    }

    return {
        "success": True,
        "restaurant": restaurant,
        "parsed_reply": parsed,
        "ready_to_schedule": parsed["has_surplus"]
    }

class AcceptAndCertifyRequest(BaseModel):
    volunteer_name: str = "Aman (Field Volunteer ID #GF-402)"
    ngo_name: str = "Green Future Foundation"
    pickup_notes: Optional[str] = "Inspected clean thermal containers and packaging."

@router.post("/{restaurant_id}/accept-and-certify")
async def accept_and_certify_donation(restaurant_id: str, payload: AcceptAndCertifyRequest):
    """
    NGO Dual-Confirmation & Certificate Generation:
    1. Validates that the donor previously submitted surplus (server timestamp 1).
    2. Logs the NGO acceptance action with server timestamp 2 and volunteer ID.
    3. Issues the official FSSAI 2019 Good Samaritan Liability Protection Certificate.
    4. Automatically dispatches the verified certificate link to the donor via WhatsApp.
    """
    from app.services.certificate_service import create_liability_certificate

    restaurant = next((r for r in RESTAURANTS_DB if r["id"] == restaurant_id), None)
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    surplus_data = restaurant.get("surplus_data")
    donor_submitted_at = surplus_data.get("donor_submitted_at") if surplus_data else None

    # Strict Rule: Must have donor submission timestamp
    if not donor_submitted_at:
        raise HTTPException(
            status_code=400,
            detail="Dual-Party Confirmation Violation: Cannot generate certificate. The donor has not submitted a surplus offer yet. Both donor submission and NGO acceptance timestamps are legally required under FSSAI 2019."
        )

    ngo_accepted_at = datetime.now().isoformat()
    food_desc = surplus_data.get("reply_text") or f"{restaurant.get('avg_daily_surplus', '40 portions')} of {restaurant.get('cuisine', 'fresh food')}"

    # Generate immutable dual-confirmed certificate
    cert = create_liability_certificate(
        donor_name=restaurant["name"],
        donor_phone=restaurant.get("phone", settings.DEFAULT_RESTAURANT_NUMBER),
        donor_address=restaurant.get("address", "Civil Lines, Jaipur"),
        food_description=food_desc,
        donor_submitted_at=donor_submitted_at,
        ngo_accepted_at=ngo_accepted_at,
        ngo_accepted_by=payload.volunteer_name,
        ngo_name=payload.ngo_name
    )

    # Automatically notify donor via WhatsApp with certificate link
    target_phone = restaurant.get("phone", settings.DEFAULT_RESTAURANT_NUMBER)
    cert_id = cert["id"]
    verification_url = cert["security"]["verificationUrl"]

    whatsapp_msg = (
        f"Namaste! 🙏 Green Future Foundation has verified and officially accepted your surplus food donation.\n\n"
        f"📜 Official FSSAI 2019 Donation Protection Certificate Generated!\n\n"
        f"🛡️ Legal Protection: Under FSSAI (Recovery & Distribution of Surplus Food) Regulations 2019, "
        f"your good-faith donation is legally protected from civil and criminal liability.\n\n"
        f"• Certificate ID: {cert_id}\n"
        f"• Verified Link: {verification_url}\n\n"
        f"Thank you for helping us feed families in need today!"
    )

    whatsapp_result = await send_twilio_whatsapp(
        to_number=target_phone,
        message=whatsapp_msg
    )

    # Update restaurant state
    restaurant["status"] = "Certificate Issued & Protected"
    restaurant["certificate"] = cert
    restaurant["ngo_acceptance"] = {
        "accepted_at": ngo_accepted_at,
        "accepted_by": payload.volunteer_name,
        "notes": payload.pickup_notes
    }

    return {
        "success": True,
        "message": f"Liability Protection Certificate generated and dispatched to {restaurant['name']}",
        "certificate": cert,
        "whatsapp_notification": whatsapp_result
    }

@router.post("/webhook/twilio/whatsapp")
async def twilio_whatsapp_webhook(
    From: str = Form(...),
    Body: str = Form(...),
    MessageSid: str = Form(...)
):
    """
    Live Twilio Webhook receiving incoming WhatsApp replies from restaurant managers.
    """
    clean_sender = From.replace("whatsapp:", "")
    parsed = await parse_restaurant_reply(Body)

    # Find restaurant matching sender
    matched = None
    for r in RESTAURANTS_DB:
        if clean_sender in r.get("phone", ""):
            matched = r
            break

    if matched:
        now_iso = datetime.now().isoformat()
        if parsed["has_surplus"]:
            matched["status"] = "Surplus Confirmed"
            matched["surplus_data"] = {
                "confirmed_at": now_iso,
                "donor_submitted_at": now_iso,
                "reply_text": Body,
                "parsed": parsed
            }
        matched["last_reply"] = {
            "timestamp": now_iso,
            "text": Body,
            "parsed": parsed,
            "sid": MessageSid
        }

    # Respond with TwiML
    ack_text = (
        "Namaste! Thank you for confirming surplus food. Our volunteer driver is on the way. "
        "Upon pickup, an official FSSAI 2019 Liability Protection Certificate will be issued to you. - Green Future Foundation"
    )
    twiml_response = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>{ack_text}</Message>
</Response>"""

    from fastapi.responses import Response
    return Response(content=twiml_response, media_type="application/xml")

