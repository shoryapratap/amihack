import os
from datetime import datetime
from app.services.ngo_fallback import lookup_fssai
from app.services.scrapers.focos_scraper import FoSCoSScraper

async def verify_fssai(fssai_number: str) -> dict:
    clean_fssai = fssai_number.strip()

    # 1. Attempt live portal lookup if configured
    foscos_enabled = os.getenv("FOSCOS_ENABLED", "false").lower() == "true"
    if foscos_enabled:
        try:
            scraper = FoSCoSScraper()
            result = await scraper.search(clean_fssai)
            if result:
                return {
                    "success": True,
                    "verification_type": "FSSAI",
                    "identifier": clean_fssai,
                    "status": result.get("status", "verified"),
                    "source": "fssai_foscos_public_database",
                    "organization_name": result.get("organization_name"),
                    "license_status": result.get("license_status", "Active"),
                    "message": "FSSAI license information verified directly from public FoSCoS database.",
                    "fallback_used": False,
                    "verified_at": datetime.utcnow()
                }
        except Exception:
            pass

    # 2. Lookup in verified registry / fallback database
    fallback = lookup_fssai(clean_fssai)
    if fallback:
        is_active = fallback.get("license_status", "").lower() == "active"
        return {
            "success": is_active,
            "verification_type": "FSSAI",
            "identifier": clean_fssai,
            "status": fallback["status"],
            "source": "fssai_verified_ledger",
            "organization_name": fallback["organization_name"],
            "license_status": fallback["license_status"],
            "message": fallback["message"],
            "fallback_used": True,
            "verified_at": datetime.utcnow()
        }

    return {
        "success": False,
        "verification_type": "FSSAI",
        "identifier": clean_fssai,
        "status": "not_found",
        "source": "fssai_verified_ledger",
        "organization_name": None,
        "license_status": None,
        "message": f"FSSAI license/registration number '{clean_fssai}' was not found.",
        "fallback_used": True,
        "verified_at": datetime.utcnow()
    }
