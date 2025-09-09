# routers/its.py
import os
import uuid
import shutil
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, UploadFile, File, Path, HTTPException
from models.its import ITSRequest
from arango import ArangoClient
from dotenv import load_dotenv

router = APIRouter(prefix="/its", tags=["ITS"])

# Cargar variables de entorno
load_dotenv()
ARANGO_USERNAME = os.getenv("ARANGO_USERNAME")
ARANGO_PASSWORD = os.getenv("ARANGO_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

UPLOAD_DIR = "archivos"

# Conectar a ArangoDB
client = ArangoClient()
db = client.db(DB_NAME, username=ARANGO_USERNAME, password=ARANGO_PASSWORD)

# Colecciones
usuarios_col = db.collection("usuarios")
analisis_col = db.collection("analisis")
muestras_col = db.collection("muestras")
secuencias_col = db.collection("secuencias")
administrativos_col = db.collection("administrativos")
sitios_col = db.collection("sitios")
sitios_esp_col = db.collection("sitios_especificos")
idext_col = db.collection("identificadores_externos")
enlaces_col = db.collection("enlaces")


# -------------------------- Subida de archivos ITS --------------------------
@router.post("/files/upload/{user_id}")
async def upload_files(
    user_id: str = Path(...),
    carpeta_muestreo: List[UploadFile] = File([]),
    datos_crudos: List[UploadFile] = File([]),
    secuencias_ensambladas: List[UploadFile] = File([]),
):
    now = datetime.now()
    unique_id = str(uuid.uuid4())

    root_path = os.path.join(
        UPLOAD_DIR, str(user_id), "its",
        str(now.year), f"{now.month:02}", f"{now.day:02}", unique_id
    )

    paths = {
        "detalle_muestreo": os.path.join(root_path, "carpeta_muestreo"),
        "datos_crudos": os.path.join(root_path, "datos_crudos"),
        "sec_ensam": os.path.join(root_path, "secuencias_ensambladas"),
    }
    for p in paths.values():
        os.makedirs(p, exist_ok=True)

    def save_files(files: List[UploadFile], dest: str):
        for f in files:
            if not f.filename:
                continue
            with open(os.path.join(dest, f.filename), "wb") as buffer:
                shutil.copyfileobj(f.file, buffer)

    save_files(carpeta_muestreo, paths["detalle_muestreo"])
    save_files(datos_crudos, paths["datos_crudos"])
    save_files(secuencias_ensambladas, paths["sec_ensam"])

    return {"id": unique_id, "urls": paths}


# -------------------------- Guardar información ITS --------------------------
@router.post("/upload/information")
def upload_its_info(payload: dict):
    try:
        type_form = payload.get("type_form", "its")
        datos_generales = payload.get("datos_generales", {})
        muestra = payload.get("muestra", {})
        datos_secuencia = payload.get("datos_secuencia", {})
        datos_admin = payload.get("datos_administrativos", {})

        user_id = datos_generales.get("id_responsable")
        fecha = datos_generales.get("date")
        link_auxiliar = datos_generales.get("link_auxiliar")
        url_detalle_muestreo = datos_generales.get("url_carpeta_muestreo")

        # 1. Validar usuario
        user_doc = usuarios_col.get(user_id)
        if not user_doc:
            raise HTTPException(status_code=400, detail=f"Usuario {user_id} no existe")

        # 2. Insertar análisis
        analisis_doc = {
            "type_form": type_form,
            "fecha": fecha,
            "id_usuario": user_id,
            "link_auxiliar": link_auxiliar,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        meta_analisis = analisis_col.insert(analisis_doc, overwrite=False)
        analisis_id = meta_analisis["_key"]

        # 3. Sitio y sitio específico
        sitio_nombre = muestra.get("sitio")
        sitio_especifico_nombre = muestra.get("sitio_especifico")

        sitio_id = None
        if sitio_nombre:
            sitio_doc = sitios_col.find({"nombre": sitio_nombre})
            if sitio_doc.empty():
                sitio_id = sitios_col.insert({"nombre": sitio_nombre})["_key"]
            else:
                sitio_id = list(sitio_doc)[0]["_key"]

        sitio_esp_id = None
        if sitio_especifico_nombre and sitio_id:
            sitio_esp_doc = sitios_esp_col.find({"nombre": sitio_especifico_nombre, "id_sitio": sitio_id})
            if sitio_esp_doc.empty():
                sitio_esp_id = sitios_esp_col.insert({
                    "nombre": sitio_especifico_nombre,
                    "id_sitio": sitio_id
                })["_key"]
            else:
                sitio_esp_id = list(sitio_esp_doc)[0]["_key"]

        # 4. Insertar muestra
        muestra_doc = {
            "id_analisis": analisis_id,
            "codigo_muestra": muestra.get("codigo_muestra"),
            "tipo_muestra": muestra.get("tipo_muestra"),
            "caracteristicas": muestra.get("carcateristicas_muestra"),
            "id_sitio": sitio_id,
            "id_sitio_especifico": sitio_esp_id,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        muestra_id = muestras_col.insert(muestra_doc)["_key"]

        # 5. Insertar secuencia
        secuencia_doc = {
            "id_muestra": muestra_id,
            "tipo_analisis": datos_secuencia.get("tipo_analisis"),
            "metodo_extraccion": datos_secuencia.get("metodo_extraccion"),
            "plataforma": datos_secuencia.get("plataforma_secuenciacion"),
            "lugar_secuenciacion": datos_secuencia.get("lugar_secuenciacion"),
            "link_datos_crudos": datos_secuencia.get("url_datos_crudos"),
            "link_secuencias_ensambladas": datos_secuencia.get("url_secuencias_ensambladas")
        }
        secuencias_col.insert(secuencia_doc)

        # 6. Identificadores externos
        idext_doc = {
            "id_analisis": analisis_id,
            "bioproject": datos_secuencia.get("bioproject"),
            "biosample": datos_secuencia.get("biosample"),
            "sra": datos_secuencia.get("sra"),
            "ncbi_assembly": datos_secuencia.get("ncbi_assembly")
        }
        idext_col.insert(idext_doc)

        # 7. Enlaces
        for campo, url in {
            "imagen_muestreo": url_detalle_muestreo,
            "datos_crudos": datos_secuencia.get("url_datos_crudos"),
            "secuencias_ensambladas": datos_secuencia.get("url_secuencias_ensambladas")
        }.items():
            if url:
                enlaces_col.insert({
                    "id_analisis": analisis_id,
                    "tipo": campo,
                    "url": url
                })

        # 8. Administrativos
        admin_doc = {
            "id_analisis": analisis_id,
            "software_pipeline": datos_admin.get("software_utilizado"),
            "publicaciones": datos_admin.get("publicaciones_relacionadas"),
            "notas": datos_admin.get("notas_comentarios")
        }
        administrativos_col.insert(admin_doc)

        return {"status": "success", "analisis_id": analisis_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------- Obtener todos los registros ITS --------------------------
@router.get("/all")
def get_all_its():
    try:
        cursor = analisis_col.find({"type_form": "its"})
        resultados = []

        for analisis in cursor:
            analisis_id = analisis["_key"]

            # Buscar muestra asociada
            muestra = list(muestras_col.find({"id_analisis": analisis_id}))
            secuencias = []
            if muestra:
                muestra_id = muestra[0]["_key"]
                secuencias = list(secuencias_col.find({"id_muestra": muestra_id}))

            # Identificadores externos
            idext = list(idext_col.find({"id_analisis": analisis_id}))

            # Enlaces
            enlaces = list(enlaces_col.find({"id_analisis": analisis_id}))

            # Administrativos
            administrativos = list(administrativos_col.find({"id_analisis": analisis_id}))

            resultados.append({
                "analisis": analisis,
                "muestra": muestra,
                "secuencias": secuencias,
                "identificadores_externos": idext,
                "enlaces": enlaces,
                "administrativos": administrativos
            })

        return {"status": "success", "total": len(resultados), "data": resultados}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
