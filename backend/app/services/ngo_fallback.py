from typing import Optional

DEMO_DARPAN_DATABASE = {
    "DL/2026/000001": {
        "organization_name": "Green Future Foundation",
        "status": "verified",
        "message": "Valid NITI Aayog NGO Darpan record found."
    },
    "DL/2026/000002": {
        "organization_name": "Helping Hands Foundation",
        "status": "verified",
        "message": "Valid NITI Aayog NGO Darpan record found."
    },
    "DL/2026/000003": {
        "organization_name": "Rural Development Society",
        "status": "verified",
        "message": "Valid NITI Aayog NGO Darpan record found."
    },
    "RJ/2021/0289145": {
        "organization_name": "Green Future Foundation",
        "status": "verified",
        "message": "Valid NITI Aayog NGO Darpan record found (Jaipur Chapter)."
    }
}

DEMO_FSSAI_DATABASE = {
    "10000000000001": {
        "organization_name": "Green Future Foundation",
        "license_status": "Active",
        "status": "verified",
        "message": "Active FSSAI Surplus Food Recovery License found."
    },
    "10000000000002": {
        "organization_name": "Helping Hands Foundation",
        "license_status": "Active",
        "status": "verified",
        "message": "Active FSSAI Surplus Food Recovery License found."
    },
    "10000000000003": {
        "organization_name": "Rural Development Society",
        "license_status": "Expired",
        "status": "not_verified",
        "message": "FSSAI record found but registration license is Expired."
    },
    "22221045000189": {
        "organization_name": "Green Future Foundation",
        "license_status": "Active",
        "status": "verified",
        "message": "Active FSSAI Food Distribution License found."
    }
}

def lookup_darpan(darpan_id: str) -> Optional[dict]:
    return DEMO_DARPAN_DATABASE.get(darpan_id.strip())

def lookup_fssai(fssai_number: str) -> Optional[dict]:
    return DEMO_FSSAI_DATABASE.get(fssai_number.strip())
