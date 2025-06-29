# routers/genomica.py
#http://localhost:8000/genomica/test
from fastapi import APIRouter, Depends
from arango.database import StandardDatabase

router = APIRouter(prefix="/genomica", tags=["Genómica"])

def get_db():
    # Se obtiene el db como dependencia
    from main import db
    return db

@router.get("/test")
def test_genomica(db: StandardDatabase = Depends(get_db)):
    return {"mensaje": "Ruta de Genómica activa", "colecciones": [c["name"] for c in db.collections()]}
