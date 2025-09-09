# models/s16s.py
from pydantic import BaseModel
from typing import Optional

class DatosGenerales16S(BaseModel):
    id_responsable: str
    date: str  # Formato YYYY-MM
    nombre_cepa: str
    estrategia_muestreo: Optional[str]
    link_auxiliar: Optional[str]

class InformacionSitio16S(BaseModel):
    sitio: Optional[str]
    sitio_especifico: Optional[str]
    profundidad: Optional[str]
    tipo_muestra: Optional[str]

class DatosSecuencia16S(BaseModel):
    tratamiento: Optional[str]
    fenotipo_1: Optional[str]
    fenotipo_2: Optional[str]
    fenotipo_3: Optional[str]
    secuencia: Optional[str]
    longitud_secuencia: Optional[int]

class Enlaces16S(BaseModel):
    link_imagenes_cepas_puras: Optional[str]
    link_imagenes_muestreo: Optional[str]
    links_ufc: Optional[str]
    link_detalles: Optional[str]

class S16SRequest(BaseModel):
    type_form: str = "16s"
    datos_generales: DatosGenerales16S
    informacion_sitio: InformacionSitio16S
    datos_secuencia: DatosSecuencia16S
    enlaces: Enlaces16S
