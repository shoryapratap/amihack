from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.ngo_models import NGO
from app.models.ngo_schemas import NGOCreate, NGOUpdate, NGOResponse

router = APIRouter(prefix="/ngos", tags=["NGO Management"])

@router.post("", response_model=NGOResponse, status_code=201, summary="Register a new NGO")
def create_ngo(data: NGOCreate, db: Session = Depends(get_db)):
    if data.darpan_id:
        existing = db.query(NGO).filter(NGO.darpan_id == data.darpan_id).first()
        if existing:
            raise HTTPException(status_code=409, detail="NGO with this Darpan ID is already registered.")

    if data.fssai_number:
        existing = db.query(NGO).filter(NGO.fssai_number == data.fssai_number).first()
        if existing:
            raise HTTPException(status_code=409, detail="NGO with this FSSAI number is already registered.")

    ngo = NGO(
        name=data.name,
        email=data.email,
        phone=data.phone,
        address=data.address,
        darpan_id=data.darpan_id,
        fssai_number=data.fssai_number,
        status="pending"
    )
    db.add(ngo)
    db.commit()
    db.refresh(ngo)
    return ngo

@router.get("", response_model=List[NGOResponse], summary="List all registered NGOs")
def list_ngos(
    status: Optional[str] = Query(None, description="Filter by status (pending, verified, partially_verified, not_verified)"),
    db: Session = Depends(get_db)
):
    query = db.query(NGO)
    if status:
        query = query.filter(NGO.status == status)
    return query.order_by(NGO.id.desc()).all()

@router.get("/{ngo_id}", response_model=NGOResponse, summary="Get NGO details by ID")
def get_ngo(ngo_id: int, db: Session = Depends(get_db)):
    ngo = db.query(NGO).filter(NGO.id == ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found.")
    return ngo

@router.put("/{ngo_id}", response_model=NGOResponse, summary="Update NGO details")
def update_ngo(ngo_id: int, data: NGOUpdate, db: Session = Depends(get_db)):
    ngo = db.query(NGO).filter(NGO.id == ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found.")

    update_data = data.model_dump(exclude_unset=True)

    if "darpan_id" in update_data and update_data["darpan_id"]:
        existing = db.query(NGO).filter(
            NGO.darpan_id == update_data["darpan_id"],
            NGO.id != ngo_id
        ).first()
        if existing:
            raise HTTPException(status_code=409, detail="Darpan ID already belongs to another NGO.")

    if "fssai_number" in update_data and update_data["fssai_number"]:
        existing = db.query(NGO).filter(
            NGO.fssai_number == update_data["fssai_number"],
            NGO.id != ngo_id
        ).first()
        if existing:
            raise HTTPException(status_code=409, detail="FSSAI number already belongs to another NGO.")

    for field, value in update_data.items():
        setattr(ngo, field, value)

    db.commit()
    db.refresh(ngo)
    return ngo

@router.delete("/{ngo_id}", summary="Delete NGO record")
def delete_ngo(ngo_id: int, db: Session = Depends(get_db)):
    ngo = db.query(NGO).filter(NGO.id == ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found.")

    db.delete(ngo)
    db.commit()
    return {"success": True, "message": f"NGO '{ngo.name}' deleted successfully."}
