from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.ngo_models import NGO, Verification
from app.models.ngo_schemas import (
    DarpanVerificationRequest,
    FSSAIVerificationRequest,
    NGOVerificationRequest,
    VerifyNGOCredentialsRequest,
    VerifyNGOCredentialsResponse,
    VerificationResult,
    VerificationHistoryResponse
)
from app.services.darpan_service import verify_darpan
from app.services.fssai_service import verify_fssai
from app.services.ngo_verification_service import (
    save_verification,
    verify_ngo_by_credentials
)

router = APIRouter(tags=["NGO Verification Engine"])

@router.post(
    "/verify/check-ngo",
    response_model=VerifyNGOCredentialsResponse,
    summary="Verify Registered NGO via Name + Darpan ID + FSSAI ID"
)
async def check_ngo_credentials(
    payload: VerifyNGOCredentialsRequest,
    db: Session = Depends(get_db)
):
    """
    Comprehensive verification gate:
    Checks if the NGO is registered in the database, verifies NITI Aayog Darpan ID,
    verifies FSSAI surplus license, and validates matching organization name.
    """
    result = await verify_ngo_by_credentials(
        db=db,
        name=payload.name,
        darpan_id=payload.darpan_id,
        fssai_number=payload.fssai_number
    )
    return result

@router.post(
    "/verify/darpan",
    response_model=VerificationResult,
    summary="Standalone Darpan ID Verification"
)
def verify_darpan_endpoint(payload: DarpanVerificationRequest):
    """
    Directly queries NITI Aayog NGO Darpan registry for legal status.
    """
    return verify_darpan(payload.darpan_id)

@router.post(
    "/verify/fssai",
    response_model=VerificationResult,
    summary="Standalone FSSAI License Verification"
)
async def verify_fssai_endpoint(payload: FSSAIVerificationRequest):
    """
    Directly queries FoSCoS / FSSAI statutory database for food recovery safety status.
    """
    return await verify_fssai(payload.fssai_number)

@router.post(
    "/ngos/{ngo_id}/verify",
    summary="Verify Registered NGO by ID"
)
async def verify_ngo_by_id(
    ngo_id: int,
    request: NGOVerificationRequest = None,
    db: Session = Depends(get_db)
):
    """
    Fetches the registered NGO record and verifies its stored Darpan and FSSAI numbers.
    Updates the NGO's status to 'verified', 'partially_verified', or 'not_verified'.
    """
    if request is None:
        request = NGOVerificationRequest(verify_darpan=True, verify_fssai=True)

    ngo = db.query(NGO).filter(NGO.id == ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO record not found.")

    results = []

    # Verify Darpan ID
    if request.verify_darpan:
        if not ngo.darpan_id:
            results.append({
                "success": False,
                "verification_type": "DARPAN",
                "identifier": "",
                "status": "missing",
                "source": "none",
                "message": "NGO does not have a Darpan ID registered.",
                "fallback_used": False
            })
        else:
            darpan_res = verify_darpan(ngo.darpan_id)
            save_verification(db, ngo.id, darpan_res)
            results.append(darpan_res)

    # Verify FSSAI
    if request.verify_fssai:
        if not ngo.fssai_number:
            results.append({
                "success": False,
                "verification_type": "FSSAI",
                "identifier": "",
                "status": "missing",
                "source": "none",
                "message": "NGO does not have an FSSAI number registered.",
                "fallback_used": False
            })
        else:
            fssai_res = await verify_fssai(ngo.fssai_number)
            save_verification(db, ngo.id, fssai_res)
            results.append(fssai_res)

    # Update status
    if not results:
        ngo.status = "pending"
    else:
        successful = [r for r in results if r.get("success")]
        if len(successful) == len(results):
            ngo.status = "verified"
        elif successful:
            ngo.status = "partially_verified"
        else:
            ngo.status = "not_verified"

    db.commit()
    db.refresh(ngo)

    return {
        "success": True,
        "ngo": {
            "id": ngo.id,
            "name": ngo.name,
            "darpan_id": ngo.darpan_id,
            "fssai_number": ngo.fssai_number,
            "status": ngo.status
        },
        "results": results
    }

@router.get(
    "/ngos/{ngo_id}/verification",
    response_model=List[VerificationHistoryResponse],
    summary="Get NGO Verification Audit History"
)
def get_verification_history(ngo_id: int, db: Session = Depends(get_db)):
    """
    Returns timestamped audit records of all previous verifications performed on this NGO.
    """
    ngo = db.query(NGO).filter(NGO.id == ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO record not found.")

    return db.query(Verification).filter(
        Verification.ngo_id == ngo_id
    ).order_by(Verification.created_at.desc()).all()
