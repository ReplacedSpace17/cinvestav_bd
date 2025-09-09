# models/its.py
from pydantic import BaseModel
from typing import Optional

class DatosGeneralesITS(BaseModel):
    id_responsable: str
    date: str  # Formato YYYY-MM
    url_carpeta_muestreo: Optional[str]
    link_auxiliar: Optional[str]

class MuestraITS(BaseModel):
    codigo_muestra: Optional[str]
    sitio: Optional[str]
    sitio_especifico: Optional[str]
    tipo_muestra: Optional[str]
    carcateristicas_muestra: Optional[str]

class DatosSecuenciaITS(BaseModel):
    tipo_analisis: Optional[str]
    metodo_extraccion: Optional[str]
    plataforma_secuenciacion: Optional[str]
    lugar_secuenciacion: Optional[str]
    url_datos_crudos: Optional[str]
    url_secuencias_ensambladas: Optional[str]
    software_utilizado: Optional[str]
    bioproject: Optional[str]
    biosample: Optional[str]
    sra: Optional[str]
    ncbi_assembly: Optional[str]

class DatosAdministrativosITS(BaseModel):
    software_utilizado: Optional[str]
    publicaciones_relacionadas: Optional[str]
    notas_comentarios: Optional[str]

class ITSRequest(BaseModel):
    datos_generales: DatosGeneralesITS
    muestra: MuestraITS
    datos_secuencia: DatosSecuenciaITS
    datos_administrativos: DatosAdministrativosITS
