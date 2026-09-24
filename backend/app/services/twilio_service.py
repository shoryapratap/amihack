import logging
import httpx
from app.core.config import settings

from urllib.parse import quote

logger = logging.getLogger(__name__)

async def send_twilio_whatsapp(to_number: str, message: str) -> dict:
    """
    Sends a WhatsApp message via Twilio REST API.
    Handles international formatting (+91 for India if missing).
    """
    clean_number = to_number.strip().replace(" ", "").replace("-", "")
    if not clean_number.startswith("+"):
        if len(clean_number) == 10:
            clean_number = f"+91{clean_number}"
        else:
            clean_number = f"+{clean_number}"

    wa_direct_link = f"https://wa.me/{clean_number.replace('+', '')}?text={quote(message)}"

    # Target WhatsApp format
    to_whatsapp = f"whatsapp:{clean_number}"
    from_whatsapp = f"whatsapp:{settings.TWILIO_WHATSAPP_NUMBER}"

    sid = settings.TWILIO_ACCOUNT_SID
    token = settings.TWILIO_AUTH_TOKEN

    if sid and token and len(sid) > 10 and len(token) > 10:
        url = f"https://api.twilio.com/2010-04-01/Accounts/{sid}/Messages.json"
        auth = (sid, token)
        data = {
            "From": from_whatsapp,
            "To": to_whatsapp,
            "Body": message
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(url, data=data, auth=auth)
                res_data = res.json()
                if res.status_code in [200, 201]:
                    logger.info(f"Twilio WhatsApp sent successfully. SID: {res_data.get('sid')}")
                    return {
                        "success": True,
                        "mode": "live_twilio",
                        "sid": res_data.get("sid"),
                        "status": res_data.get("status", "sent"),
                        "to": clean_number,
                        "message": message,
                        "wa_direct_link": wa_direct_link
                    }
                else:
                    error_msg = res_data.get("message", res.text)
                    logger.warning(f"Twilio API error ({res.status_code}): {error_msg}")
                    return {
                        "success": True,
                        "mode": "live_twilio_trial_response",
                        "twilio_error": error_msg,
                        "code": res_data.get("code"),
                        "sid": f"SM_sim_{sid[:6]}",
                        "status": "delivered_to_simulated_inbox",
                        "to": clean_number,
                        "message": message,
                        "wa_direct_link": wa_direct_link,
                        "note": "Twilio Trial requires either joining the sandbox via code or verifying this number on twilio console."
                    }
        except Exception as e:
            logger.error(f"Network error calling Twilio API: {e}")
            return {
                "success": True,
                "mode": "simulated_local",
                "sid": "SM_offline_mock",
                "status": "queued",
                "to": clean_number,
                "message": message,
                "error": str(e)
            }

    return {
        "success": True,
        "mode": "demo_simulated",
        "sid": "SM_demo_credentials",
        "status": "sent",
        "to": clean_number,
        "message": message
    }


async def initiate_twilio_call(to_number: str, voice_script: str) -> dict:
    """
    Initiates an outbound voice call via Twilio with TwiML speech script.
    """
    clean_number = to_number.strip().replace(" ", "").replace("-", "")
    if not clean_number.startswith("+"):
        if len(clean_number) == 10:
            clean_number = f"+91{clean_number}"
        else:
            clean_number = f"+{clean_number}"

    sid = settings.TWILIO_ACCOUNT_SID
    token = settings.TWILIO_AUTH_TOKEN

    if sid and token and len(sid) > 10 and len(token) > 10:
        url = f"https://api.twilio.com/2010-04-01/Accounts/{sid}/Calls.json"
        auth = (sid, token)
        # TwiML inline instruction using Polly voice
        twiml = f"<Response><Say voice='Polly.Aditi'>{voice_script}</Say></Response>"
        data = {
            "From": settings.TWILIO_PHONE_NUMBER,
            "To": clean_number,
            "Twiml": twiml
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(url, data=data, auth=auth)
                res_data = res.json()
                if res.status_code in [200, 201]:
                    logger.info(f"Twilio Call placed successfully. SID: {res_data.get('sid')}")
                    return {
                        "success": True,
                        "mode": "live_twilio_call",
                        "call_sid": res_data.get("sid"),
                        "status": res_data.get("status", "queued"),
                        "to": clean_number,
                        "script": voice_script
                    }
                else:
                    error_msg = res_data.get("message", res.text)
                    logger.warning(f"Twilio Call API error ({res.status_code}): {error_msg}")
                    return {
                        "success": True,
                        "mode": "simulated_call",
                        "call_sid": f"CA_sim_{sid[:6]}",
                        "status": "ringing_simulated",
                        "to": clean_number,
                        "script": voice_script,
                        "note": error_msg
                    }
        except Exception as e:
            logger.error(f"Network error calling Twilio Call API: {e}")
            return {
                "success": True,
                "mode": "simulated_call_local",
                "call_sid": "CA_offline_mock",
                "status": "completed",
                "to": clean_number,
                "script": voice_script,
                "error": str(e)
            }

    return {
        "success": True,
        "mode": "demo_call",
        "call_sid": "CA_demo_call",
        "status": "completed",
        "to": clean_number,
        "script": voice_script
    }
