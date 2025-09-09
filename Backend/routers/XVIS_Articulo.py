# routers/XVIS_Articulo.py
import os
from fastapi import APIRouter, HTTPException
from models.XVIS_Articulo import Articulo16SRequest
from arango import ArangoClient
from arango.exceptions import DocumentInsertError
from dotenv import load_dotenv
from datetime import datetime, timezone

router = APIRouter(prefix="/16sarticulo", tags=["16s_articulo"])

# Cargar variables de entorno
load_dotenv()
ARANGO_USERNAME = os.getenv("ARANGO_USERNAME")
ARANGO_PASSWORD = os.getenv("ARANGO_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# Conectar a ArangoDB
client = ArangoClient()
db = client.db(DB_NAME, username=ARANGO_USERNAME, password=ARANGO_PASSWORD)

# Colecciones
usuarios_col = db.collection("usuarios")
analisis_col = db.collection("analisis")
muestras_col = db.collection("muestras")
secuencias_col = db.collection("secuencias")
idext_col = db.collection("identificadores_externos")
sitios_col = db.collection("sitios")
sitios_esp_col = db.collection("sitios_especificos")

# ================== POST ==================
@router.post("/upload/information")
def upload_16s_articulo(payload: Articulo16SRequest):
    try:
        # ================== 1. Validar usuario ==================
        user_id = payload.id_responsable
        user_doc = usuarios_col.get(user_id)
        if not user_doc:
            raise HTTPException(status_code=400, detail=f"Usuario {user_id} no existe")

        # ================== 2. Insertar análisis ==================
        analisis_doc = {
            "type_form": payload.type_form,
            "fecha": payload.informacion_sitio.fecha,
            "id_usuario": user_id,
            "link_auxiliar": payload.link_auxiliar,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        meta_analisis = analisis_col.insert(analisis_doc)
        analisis_id = meta_analisis["_key"]

        # ================== 3. Manejo de sitios ==================
        sitio_nombre = payload.informacion_sitio.sitio
        sitio_especifico_nombre = payload.informacion_sitio.sitio_especifico

        sitio_doc = sitios_col.find({"nombre": sitio_nombre})
        if sitio_doc.empty():
            meta_sitio = sitios_col.insert({"nombre": sitio_nombre})
            sitio_id = meta_sitio["_key"]
        else:
            sitio_id = list(sitio_doc)[0]["_key"]

        sitio_esp_doc = sitios_esp_col.find({"nombre": sitio_especifico_nombre, "id_sitio": sitio_id})
        if sitio_esp_doc.empty():
            meta_sitio_esp = sitios_esp_col.insert({
                "nombre": sitio_especifico_nombre,
                "id_sitio": sitio_id
            })
            sitio_esp_id = meta_sitio_esp["_key"]
        else:
            sitio_esp_id = list(sitio_esp_doc)[0]["_key"]

        # ================== 4. Insertar muestra ==================
        muestra_doc = {
            "id_analisis": analisis_id,
            "tipo_muestra": payload.informacion_sitio.tipo_muestra,
            "profundidad": payload.informacion_sitio.profundidad,
            "id_sitio": sitio_id,
            "id_sitio_especifico": sitio_esp_id,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        meta_muestra = muestras_col.insert(muestra_doc)
        muestra_id = meta_muestra["_key"]

        # ================== 5. Insertar secuencia ==================
        secuencia_doc = {
            "id_muestra": muestra_id,
            "secuencia": payload.informacion_sitio.secuencia,
            "longitud_secuencia": payload.informacion_sitio.longitud_secuencia
        }
        secuencias_col.insert(secuencia_doc)

        # ================== 6. Identificadores externos ==================
        idext_doc = {
            "id_analisis": analisis_id,
            "bioproject": payload.informacion_ncbi.bioproject,
            "biosample": payload.informacion_ncbi.biosample,
            "sra": payload.informacion_ncbi.sra,
            "ncbi_assembly": payload.informacion_ncbi.ncbi_assembly,
            "accession": payload.informacion_ncbi.accession,
            "genomas": payload.informacion_ncbi.genomas,
            "taxonomias": payload.informacion_ncbi.taxonomias
        }
        idext_col.insert(idext_doc)

        return {"status": "success", "analisis_id": analisis_id}

    except DocumentInsertError as e:
        raise HTTPException(status_code=500, detail=f"Error al insertar: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ================== GET ALL ==================
@router.get("/all")
def get_all_16s_articulo():
    try:
        analisis_docs = analisis_col.find({"type_form": "16s_articulo"})
        resultados = []

        for analisis in analisis_docs:
            analisis_id = analisis["_key"]

            # Muestra
            muestra_doc = muestras_col.find({"id_analisis": analisis_id})
            muestra_data = list(muestra_doc)
            muestra_info = muestra_data[0] if muestra_data else {}

            # Secuencia
            sec_doc = secuencias_col.find({"id_muestra": muestra_info.get("_key")})
            secuencia_info = list(sec_doc)[0] if sec_doc else {}

            # Identificadores externos
            idext_doc = idext_col.find({"id_analisis": analisis_id})
            idext_info = list(idext_doc)[0] if idext_doc else {}

            # Sitios
            sitio_info = {}
            sitio_esp_info = {}
            if muestra_info.get("id_sitio"):
                sitio_doc = sitios_col.get(muestra_info["id_sitio"])
                if sitio_doc:
                    sitio_info = sitio_doc
            if muestra_info.get("id_sitio_especifico"):
                sitio_esp_doc = sitios_esp_col.get(muestra_info["id_sitio_especifico"])
                if sitio_esp_doc:
                    sitio_esp_info = sitio_esp_doc

            resultado = {
                "analisis": analisis,
                "muestra": muestra_info,
                "secuencia": secuencia_info,
                "identificadores_externos": idext_info,
                "sitio": sitio_info,
                "sitio_especifico": sitio_esp_info
            }

            resultados.append(resultado)

        return {"status": "success", "data": resultados}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
