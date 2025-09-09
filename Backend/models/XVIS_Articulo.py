# models/XVIS_Articulo.py
from pydantic import BaseModel
from typing import Optional

class InformacionSitio(BaseModel):
    fecha: str  # Formato YYYY-MM
    sitio: str
    sitio_especifico: str
    profundidad: Optional[str]
    tipo_muestra: Optional[str]
    secuencia: str
    longitud_secuencia: int

class InformacionNCBI(BaseModel):
    bioproject: Optional[str]
    biosample: Optional[str]
    sra: Optional[str]
    ncbi_assembly: Optional[str]
    accession: Optional[str]
    genomas: Optional[str]
    taxonomias: Optional[str]

class Articulo16SRequest(BaseModel):
    type_form: str
    id_responsable: str
    informacion_sitio: InformacionSitio
    informacion_ncbi: InformacionNCBI
    link_auxiliar: Optional[str]
