# models/diec8s.py
from pydantic import BaseModel
from typing import Optional


class DatosGenerales18s(BaseModel):
    id_responsable: str
    fecha: str  # Formato YYYY-MM
    nombre_cepa: Optional[str]
    estrategia_muestreo: Optional[str]


class InformacionSitio18s(BaseModel):
    sitio: Optional[str]
    sitio_especifico: Optional[str]
    profundidad: Optional[str]
    tipo_muestra: Optional[str]


class DatosSecuencia18s(BaseModel):
    tratamiento: Optional[str]
    fenotipo_1: Optional[str]
    fenotipo_2: Optional[str]
    fenotipo_3: Optional[str]
    secuencia: Optional[str]
    longitud_secuencia: Optional[int]


class Enlaces18s(BaseModel):
    imagenes_cepas_puras: Optional[str]
    imagenes_muestreo: Optional[str]
    ufc: Optional[str]
    detalle_muestreo: Optional[str]


class Diec8sRequest(BaseModel):
    type_form: str
    datos_generales: DatosGenerales18s
    informacion_sitio: InformacionSitio18s
    datos_secuencia: DatosSecuencia18s
    enlaces: Enlaces18s
    link_auxiliar: Optional[str]
