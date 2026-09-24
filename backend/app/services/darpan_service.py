from datetime import datetime
from app.services.ngo_fallback import lookup_darpan

def verify_darpan(darpan_id: str) -> dict:
    clean_id = darpan_id.strip()
    result = lookup_darpan(clean_id)

    if result:
        return {
            "success": True,
            "verification_type": "DARPAN",
            "identifier": clean_id,
            "status": result["status"],
            "source": "niti_aayog_darpan_registry",
            "organization_name": result["organization_name"],
            "license_status": None,
            "message": result["message"],
            "fallback_used": True,
            "verified_at": datetime.utcnow()
        }

    return {
        "success": False,
        "verification_type": "DARPAN",
        "identifier": clean_id,
        "status": "not_found",
        "source": "niti_aayog_darpan_registry",
        "organization_name": None,
        "license_status": None,
        "message": f"NITI Aayog Darpan ID '{clean_id}' was not found in the verified registry.",
        "fallback_used": True,
        "verified_at": datetime.utcnow()
    }
