from pydantic import BaseModel
from typing import Optional, List

class Imagen(BaseModel):
    name: str
    base64: str
    description: Optional[str]

class SecuenciaInfo(BaseModel):
    extension: str
    encabezado: str
    secuencia: str

class DatosGenerales(BaseModel):
    url_carpeta_muestreo: str
    id_responsable: str
    link_auxiliar: Optional[str]
    date: str  # YYYY-MM
    imgs: Optional[List[Imagen]] = []

class Muestra(BaseModel):
    codigo_muestra: str
    genero: Optional[str]
    numero_cepario_GOB: Optional[str]
    sitio: Optional[str]
    sitio_especifico: Optional[str]
    tipo_muestra: Optional[str]
    carcateristicas_muestra: Optional[str]

class DatosSecuencia(BaseModel):
    tipo_analisis: Optional[str]
    metodo_extraccion: Optional[str]
    plataforma_secuenciacion: Optional[str]
    lugar_secuenciacion: Optional[str]
    url_datos_crudos: Optional[List[SecuenciaInfo]] = []
    url_secuencias_ensambladas: Optional[List[SecuenciaInfo]] = []
    software_utilizado: Optional[str]
    bioproject: Optional[str]
    biosample: Optional[str]
    sra: Optional[str]
    ncbi_assembly: Optional[str]

class DatosAdministrativos(BaseModel):
    software_utilizado: Optional[str]
    publicaciones_relacionadas: Optional[str]
    notas_comentarios: Optional[str]

class GenomicaRequest(BaseModel):
    type_form: str
    datos_generales: DatosGenerales
    muestra: Muestra
    datos_secuencia: DatosSecuencia
    datos_administrativos: DatosAdministrativos
