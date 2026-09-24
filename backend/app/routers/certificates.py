from fastapi import APIRouter, HTTPException, Query, Body
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from app.services.certificate_service import (
    create_liability_certificate,
    get_certificate_by_id,
    list_all_certificates,
    FSSAI_REGULATION_CITATION,
    FSSAI_REGULATION_TITLE,
    FSSAI_REGULATION_TEXT
)

router = APIRouter(prefix="/certificates", tags=["Donor Trust & FSSAI Liability Protection"])

class IssueCertificateRequest(BaseModel):
    donor_name: str
    donor_phone: str
    donor_address: str = "Civil Lines, Jaipur"
    food_description: str
    donor_submitted_at: str = Field(..., description="Server timestamp of donor submission")
    ngo_accepted_at: str = Field(..., description="Server timestamp of recipient NGO acceptance")
    ngo_accepted_by: str = "Aman (Field Volunteer ID #GF-402)"
    ngo_name: str = "Green Future Foundation"
    ngo_darpan_id: str = "RJ/2021/0289145"
    ngo_fssai_reg: str = "22221045000189"

@router.get("")
def get_all_certificates():
    """
    Returns list of all issued liability protection certificates.
    """
    return {
        "success": True,
        "count": len(list_all_certificates()),
        "certificates": list_all_certificates()
    }

@router.get("/legal-clause")
def get_fssai_legal_clause():
    """
    Returns the official FSSAI 2019 legal clause protecting good-faith food donors.
    """
    return {
        "success": True,
        "citation": FSSAI_REGULATION_CITATION,
        "title": FSSAI_REGULATION_TITLE,
        "full_text": FSSAI_REGULATION_TEXT,
        "summary": "Protects bona fide food donors and non-profit distribution agencies from civil and criminal liability for consumption-related harm, provided food was donated in good faith."
    }

@router.get("/verify/{cert_id}")
@router.get("/{cert_id}")
def verify_certificate(cert_id: str):
    """
    Public verification endpoint: Pulls live, authentic data directly from the database.
    Used by anyone scanning the QR code or visiting /verify/:id.
    """
    cert = get_certificate_by_id(cert_id)
    if not cert:
        raise HTTPException(
            status_code=404,
            detail=f"Certificate '{cert_id}' not found in the verified FSSAI audit registry."
        )
    return {
        "success": True,
        "verified": True,
        "certificate": cert
    }

@router.get("/{cert_id}/download")
@router.get("/{cert_id}/pdf")
def download_certificate_pdf(cert_id: str):
    """
    Dynamically generates and streams the official FSSAI 2019 Donation Protection Certificate as a PDF.
    """
    from fastapi.responses import Response
    from app.services.pdf_service import generate_certificate_pdf

    cert = get_certificate_by_id(cert_id)
    if not cert:
        raise HTTPException(
            status_code=404,
            detail=f"Certificate '{cert_id}' not found in the registry."
        )

    pdf_bytes = generate_certificate_pdf(cert)
    headers = {
        "Content-Disposition": f'inline; filename="FSSAI_Certificate_{cert_id}.pdf"',
        "Cache-Control": "public, max-age=3600"
    }
    return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)

@router.post("/issue")
def issue_certificate_endpoint(payload: IssueCertificateRequest):
    """
    Strict Dual-Party Confirmation Gate:
    Generates a certificate ONLY if both donor submission and NGO acceptance timestamps are supplied.
    """
    if not payload.donor_submitted_at or not payload.ngo_accepted_at:
        raise HTTPException(
            status_code=400,
            detail="Dual-Party Confirmation Violation: Both donor submission timestamp and recipient NGO acceptance timestamp are strictly required before a certificate can be issued."
        )

    try:
        cert = create_liability_certificate(
            donor_name=payload.donor_name,
            donor_phone=payload.donor_phone,
            donor_address=payload.donor_address,
            food_description=payload.food_description,
            donor_submitted_at=payload.donor_submitted_at,
            ngo_accepted_at=payload.ngo_accepted_at,
            ngo_accepted_by=payload.ngo_accepted_by,
            ngo_name=payload.ngo_name,
            ngo_darpan_id=payload.ngo_darpan_id,
            ngo_fssai_reg=payload.ngo_fssai_reg
        )
        return {
            "success": True,
            "message": "FSSAI 2019 Liability Protection Certificate successfully generated.",
            "certificate": cert
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
