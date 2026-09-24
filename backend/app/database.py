import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ngo_verification.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    from app.models.ngo_models import NGO, Verification
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed if database is empty
    db = SessionLocal()
    try:
        existing = db.query(NGO).count()
        if existing == 0:
            demo_ngos = [
                NGO(
                    name="Green Future Foundation",
                    email="green@example.com",
                    phone="9876543210",
                    address="Jaipur, Rajasthan",
                    darpan_id="DL/2026/000001",
                    fssai_number="10000000000001",
                    status="pending"
                ),
                NGO(
                    name="Helping Hands Foundation",
                    email="helping@example.com",
                    phone="9876543211",
                    address="Delhi, India",
                    darpan_id="DL/2026/000002",
                    fssai_number="10000000000002",
                    status="pending"
                ),
                NGO(
                    name="Rural Development Society",
                    email="rural@example.com",
                    phone="9876543212",
                    address="Kota, Rajasthan",
                    darpan_id="DL/2026/000003",
                    fssai_number="10000000000003",
                    status="pending"
                ),
            ]
            db.add_all(demo_ngos)
            db.commit()
            print("[Database] Initialized and seeded demo NGO records successfully.")
    except Exception as e:
        print(f"[Database] Error checking/seeding NGO records: {e}")
    finally:
        db.close()
