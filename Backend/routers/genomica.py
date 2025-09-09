# routers/genomica.py
import os
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, HTTPException
from models.genomica import GenomicaRequest
from arango import ArangoClient
from dotenv import load_dotenv

router = APIRouter(prefix="/genomica", tags=["Genómica"])

# ================== Configuración ==================
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
secuencias_col = db.collection("info_secuencias")
administrativos_col = db.collection("administrativos")
imagenes_col = db.collection("imagenes")
idext_col = db.collection("identificadores_externos")
sitios_col = db.collection("sitios")
sitios_esp_col = db.collection("sitios_especificos")


# ================== POST: Subir información de Genómica ==================
@router.post("/upload/information")
def upload_genomica_info(payload: GenomicaRequest):
    try:
        # ================== 1. Extraer campos ==================
        type_form = payload.type_form
        datos_generales = payload.datos_generales
        muestra = payload.muestra
        datos_secuencia = payload.datos_secuencia
        datos_admin = payload.datos_administrativos

        user_id = datos_generales.id_responsable
        fecha = datos_generales.date
        link_auxiliar = datos_generales.link_auxiliar
        url_detalle_muestreo = datos_generales.url_carpeta_muestreo

        # ================== 2. Validar usuario ==================
        user_doc = usuarios_col.get(user_id)
        if not user_doc:
            raise HTTPException(status_code=400, detail=f"Usuario {user_id} no existe")

        # ================== 3. Insertar análisis ==================
        analisis_doc = {
            "type_form": type_form,
            "fecha": fecha,
            "id_usuario": user_id,
            "link_auxiliar": link_auxiliar,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        analisis_id = analisis_col.insert(analisis_doc)["_key"]

        # ================== 4. Sitio y sitio específico ==================
        sitio_doc = list(sitios_col.find({"nombre": muestra.sitio}))
        if sitio_doc:
            sitio_id = sitio_doc[0]["_key"]
        else:
            sitio_id = sitios_col.insert({"nombre": muestra.sitio})["_key"]

        sitio_esp_doc = list(sitios_esp_col.find({
            "nombre": muestra.sitio_especifico,
            "id_sitio": sitio_id
        }))
        if sitio_esp_doc:
            sitio_esp_id = sitio_esp_doc[0]["_key"]
        else:
            sitio_esp_id = sitios_esp_col.insert({
                "nombre": muestra.sitio_especifico,
                "id_sitio": sitio_id
            })["_key"]

        # ================== 5. Insertar muestra ==================
        muestra_doc = {
            "id_analisis": analisis_id,
            "codigo_muestra": muestra.codigo_muestra,
            "genero": muestra.genero,
            "numero_cepario_gob": muestra.numero_cepario_GOB,
            "tipo_muestra": muestra.tipo_muestra,
            "caracteristicas": muestra.carcateristicas_muestra,
            "id_sitio": sitio_id,
            "id_sitio_especifico": sitio_esp_id,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        muestra_id = muestras_col.insert(muestra_doc)["_key"]

        # ================== 6. Insertar secuencias ==================
        for secuencia in datos_secuencia.url_datos_crudos:
            secuencias_col.insert({
                "id_analisis": analisis_id,
                "type": 1,  # datos crudos
                "extension": secuencia.extension,
                "encabezado": secuencia.encabezado,
                "secuencia": secuencia.secuencia
            })
        for secuencia in datos_secuencia.url_secuencias_ensambladas:
            secuencias_col.insert({
                "id_analisis": analisis_id,
                "type": 2,  # secuencias ensambladas
                "extension": secuencia.extension,
                "encabezado": secuencia.encabezado,
                "secuencia": secuencia.secuencia
            })

        # ================== 7. Insertar imágenes ==================
        for img in datos_generales.imgs:
            imagenes_col.insert({
                "id_analisis": analisis_id,
                "nombre": img.name,
                "base64": img.base64,
                "descripcion": img.description
            })

        # ================== 8. Insertar administrativos ==================
        administrativos_col.insert({
            "id_analisis": analisis_id,
            "software_pipeline": datos_admin.software_utilizado,
            "publicaciones": datos_admin.publicaciones_relacionadas,
            "notas": datos_admin.notas_comentarios
        })

        # ================== 9. Identificadores externos ==================
        idext_col.insert({
            "id_analisis": analisis_id,
            "bioproject": datos_secuencia.bioproject,
            "biosample": datos_secuencia.biosample,
            "sra": datos_secuencia.sra,
            "ncbi_assembly": datos_secuencia.ncbi_assembly
        })

        return {"status": "success", "analisis_id": analisis_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ================== GET: Obtener todos los registros de Genómica ==================
@router.get("/all/genomica")
def get_all_genomica():
    try:
        resultados = []
        analisis_docs = analisis_col.find({"type_form": "genomica"})

        for analisis in analisis_docs:
            analisis_id = analisis["_key"]

            # Obtener muestra
            muestra_doc = list(muestras_col.find({"id_analisis": analisis_id}))
            muestra_info = muestra_doc[0] if muestra_doc else {}

            # Obtener secuencias
            secuencias_docs = list(secuencias_col.find({"id_analisis": analisis_id}))
            datos_crudos = [s for s in secuencias_docs if s.get("type") == 1]
            secuencias_ensambladas = [s for s in secuencias_docs if s.get("type") == 2]

            # Obtener administrativos
            admin_doc = list(administrativos_col.find({"id_analisis": analisis_id}))
            admin_info = admin_doc[0] if admin_doc else {}

            # Obtener identificadores externos
            idext_doc = list(idext_col.find({"id_analisis": analisis_id}))
            idext_info = idext_doc[0] if idext_doc else {}

            # Obtener imágenes
            imagenes_doc = list(imagenes_col.find({"id_analisis": analisis_id}))

            # Obtener sitios
            sitio_info = sitios_col.get(muestra_info.get("id_sitio")) if muestra_info.get("id_sitio") else {}
            sitio_esp_info = sitios_esp_col.get(muestra_info.get("id_sitio_especifico")) if muestra_info.get("id_sitio_especifico") else {}

            resultado = {
                "analisis": analisis,
                "muestra": muestra_info,
                "secuencias": {
                    "datos_crudos": datos_crudos,
                    "secuencias_ensambladas": secuencias_ensambladas
                },
                "administrativos": admin_info,
                "identificadores_externos": idext_info,
                "imagenes": imagenes_doc,
                "sitio": sitio_info,
                "sitio_especifico": sitio_esp_info
            }
            resultados.append(resultado)

        return {"status": "success", "data": resultados}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
