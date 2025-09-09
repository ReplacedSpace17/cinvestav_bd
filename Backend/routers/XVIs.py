# routers/s16s.py
# routers/genomica.py
import os
import uuid
import shutil
from datetime import datetime
from typing import List
from fastapi import APIRouter, UploadFile, File, Path, HTTPException
from models.XVIs import S16SRequest
from arango import ArangoClient
from arango.exceptions import DocumentInsertError
from dotenv import load_dotenv
from datetime import datetime, timezone


UPLOAD_DIR = "archivos"  # Carpeta raíz

router = APIRouter(prefix="/16s", tags=["16S"])

# Conexión a ArangoDB
ARANGO_USERNAME = os.getenv("ARANGO_USERNAME")
ARANGO_PASSWORD = os.getenv("ARANGO_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

client = ArangoClient()
db = client.db(DB_NAME, username=ARANGO_USERNAME, password=ARANGO_PASSWORD)

usuarios_col = db.collection("usuarios")
analisis_col = db.collection("analisis")
muestras_col = db.collection("muestras")
secuencias_col = db.collection("secuencias")
enlaces_col = db.collection("enlaces")

sitios_col = db.collection("sitios")
sitios_esp_col = db.collection("sitios_especificos")

#--------------------------------------------------------------------------- subir los files de 16s
@router.post("/files/upload/{user_id}")
async def upload_files(
    user_id: str = Path(...),
    imagenes_cepas_puras: List[UploadFile] = File([]),
    imagenes_muestreo: List[UploadFile] = File([]),
    ufc: List[UploadFile] = File([]),
    carpeta_detalles: List[UploadFile] = File([]),
):
    now = datetime.now()
    unique_id = str(uuid.uuid4())

    # Carpeta base: archivos/{user_id}/genomica/año/mes/dia/unique_id
    root_path = os.path.join(
        UPLOAD_DIR,
        str(user_id),
        "16s",
        str(now.year),
        f"{now.month:02}",
        f"{now.day:02}",
        unique_id
    )

    # Subcarpetas
    paths = {
        "link_imagenes_cepas_puras": os.path.join(root_path, "cepas_puras"),
        "link_imagenes_muestreo": os.path.join(root_path, "imagenes_muestreo"),
        "links_ufc": os.path.join(root_path, "ufc"),
        "link_detalles": os.path.join(root_path, "detalle_muestreo"),
    }
    for p in paths.values():
        os.makedirs(p, exist_ok=True)

    # Guardar archivos
    def save_files(files: List[UploadFile], dest: str):
        for f in files:
            if not f.filename:
                continue
            file_path = os.path.join(dest, f.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(f.file, buffer)

    save_files(imagenes_cepas_puras, paths["link_imagenes_cepas_puras"])
    save_files(imagenes_muestreo, paths["link_imagenes_muestreo"])
    save_files(ufc, paths["links_ufc"])
    save_files(carpeta_detalles, paths["link_detalles"])

    # URLs relativas
    urls = {
        "link_imagenes_cepas_puras": f"{paths['link_imagenes_cepas_puras']}",
        "link_imagenes_muestreo": f"{paths['link_imagenes_muestreo']}",
        "links_ufc": f"{paths['links_ufc']}",
        "link_detalles": f"{paths['link_detalles']}",
    }

    return {"id": unique_id, "urls": urls}

#--------------------------------------------------------------------------- subir la info de 16s

@router.post("/upload/information")
def upload_16s_info(payload: S16SRequest):
    try:
        datos_generales = payload.datos_generales
        info_sitio = payload.informacion_sitio
        datos_secuencia = payload.datos_secuencia
        enlaces = payload.enlaces

        user_id = datos_generales.id_responsable
        fecha = datos_generales.date
        link_auxiliar = datos_generales.link_auxiliar

        # ================== Validar usuario ==================
        user_doc = usuarios_col.get(user_id)
        if not user_doc:
            raise HTTPException(status_code=400, detail=f"Usuario {user_id} no existe")

        # ================== Insertar análisis ==================
        analisis_doc = {
            "type_form": payload.type_form,
            "fecha": fecha,
            "id_usuario": user_id,
            "link_auxiliar": link_auxiliar,
            "nombre_cepa": datos_generales.nombre_cepa,
            "estrategia_muestreo": datos_generales.estrategia_muestreo,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        meta_analisis = analisis_col.insert(analisis_doc)
        analisis_id = meta_analisis["_key"]

        # ================== Sitio y sitio específico ==================
        sitio_doc = sitios_col.find({"nombre": info_sitio.sitio})
        if sitio_doc.empty():
            meta_sitio = sitios_col.insert({"nombre": info_sitio.sitio})
            sitio_id = meta_sitio["_key"]
        else:
            sitio_id = list(sitio_doc)[0]["_key"]

        sitio_esp_doc = sitios_esp_col.find({"nombre": info_sitio.sitio_especifico, "id_sitio": sitio_id})
        if sitio_esp_doc.empty():
            meta_sitio_esp = sitios_esp_col.insert({
                "nombre": info_sitio.sitio_especifico,
                "id_sitio": sitio_id
            })
            sitio_esp_id = meta_sitio_esp["_key"]
        else:
            sitio_esp_id = list(sitio_esp_doc)[0]["_key"]

        # ================== Insertar muestra ==================
        muestra_doc = {
            "id_analisis": analisis_id,
            "nombre_cepa": datos_generales.nombre_cepa,
            "estrategia_muestreo": datos_generales.estrategia_muestreo,
            "tipo_muestra": info_sitio.tipo_muestra,
            "profundidad": info_sitio.profundidad,
            "id_sitio": sitio_id,
            "id_sitio_especifico": sitio_esp_id,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        meta_muestra = muestras_col.insert(muestra_doc)
        muestra_id = meta_muestra["_key"]

        # ================== Insertar secuencia ==================
        secuencia_doc = {
            "id_muestra": muestra_id,
            "tratamiento": datos_secuencia.tratamiento,
            "fenotipo1": datos_secuencia.fenotipo_1,
            "fenotipo2": datos_secuencia.fenotipo_2,
            "fenotipo3": datos_secuencia.fenotipo_3,
            "secuencia": datos_secuencia.secuencia,
            "longitud_secuencia": datos_secuencia.longitud_secuencia
        }
        secuencias_col.insert(secuencia_doc)

        # ================== Insertar enlaces ==================
        enlaces_dict = {
            "imagen_cepa_pura": enlaces.link_imagenes_cepas_puras,
            "imagen_muestreo": enlaces.link_imagenes_muestreo,
            "ufc": enlaces.links_ufc,
            "detalle": enlaces.link_detalles
        }

        for tipo, url in enlaces_dict.items():
            if url:
                enlaces_col.insert({
                    "id_analisis": analisis_id,
                    "tipo": tipo,
                    "url": url
                })

        return {"status": "success", "analisis_id": analisis_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#--------------------------------------------------------------------------- obtener la info de 16s#--------------------------------------------------------------------------- obtener todos los registros de 16s
@router.get("/all")
def get_all_16s():
    try:
        # Traer todos los análisis que sean de tipo 16s
        analisis_docs = analisis_col.find({"type_form": "16s"})
        resultados = []

        for analisis in analisis_docs:
            analisis_id = analisis["_key"]

            # Buscar muestra relacionada
            muestras = list(muestras_col.find({"id_analisis": analisis_id}))

            # Buscar secuencias relacionadas
            secuencias = []
            for m in muestras:
                secuencias.extend(list(secuencias_col.find({"id_muestra": m["_key"]})))

            # Buscar enlaces relacionados
            enlaces = list(enlaces_col.find({"id_analisis": analisis_id}))

            # Construir respuesta
            resultados.append({
                "analisis": analisis,
                "muestras": muestras,
                "secuencias": secuencias,
                "enlaces": enlaces
            })

        return {"status": "success", "registros": resultados}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
