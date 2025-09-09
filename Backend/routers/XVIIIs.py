# routers/XVIII.py
import os
import uuid
import shutil
from datetime import datetime
from typing import List
from fastapi import APIRouter, UploadFile, File, Path, HTTPException
from models.XVIIIs import Diec8sRequest
from arango import ArangoClient
from arango.exceptions import DocumentInsertError
from dotenv import load_dotenv
from datetime import datetime, timezone

router = APIRouter(prefix="/18s", tags=["18S"])
UPLOAD_DIR = "archivos"  # Carpeta raíz

# Cargar variables de entorno
load_dotenv()
ARANGO_USERNAME = os.getenv("ARANGO_USERNAME")
ARANGO_PASSWORD = os.getenv("ARANGO_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# Conectar a ArangoDB
client = ArangoClient()
db = client.db(DB_NAME, username=ARANGO_USERNAME, password=ARANGO_PASSWORD)


#archivos de 18s
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
        "18s",
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

# subir infomración de 18S
@router.post("/upload/information")
def upload_18s_info(payload: Diec8sRequest):
    try:
        # ================== 1. Extraer campos ==================
        type_form = payload.type_form
        datos_generales = payload.datos_generales.dict()
        info_sitio = payload.informacion_sitio.dict()
        datos_secuencia = payload.datos_secuencia.dict()
        enlaces = payload.enlaces.dict()
        link_auxiliar = payload.link_auxiliar

        user_id = datos_generales.get("id_responsable")
        fecha = datos_generales.get("fecha")
        nombre_cepa = datos_generales.get("nombre_cepa")
        estrategia_muestreo = datos_generales.get("estrategia_muestreo")

        # ================== 2. Validar usuario ==================
        user_doc = db.collection("usuarios").get(user_id)
        if not user_doc:
            raise HTTPException(status_code=400, detail=f"Usuario {user_id} no existe")

        # ================== 3. Insertar análisis ==================
        analisis_col = db.collection("analisis")
        analisis_doc = {
            "type_form": type_form,
            "fecha": fecha,
            "id_usuario": user_id,
            "link_auxiliar": link_auxiliar,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        meta_analisis = analisis_col.insert(analisis_doc, overwrite=False)
        analisis_id = meta_analisis["_key"]

        # ================== 4. Sitio y sitio específico ==================
        sitios_col = db.collection("sitios")
        sitios_esp_col = db.collection("sitios_especificos")

        sitio_nombre = info_sitio.get("sitio")
        sitio_especifico_nombre = info_sitio.get("sitio_especifico")

        sitio_id = None
        if sitio_nombre:
            sitio_doc = sitios_col.find({"nombre": sitio_nombre})
            if sitio_doc.empty():
                meta_sitio = sitios_col.insert({"nombre": sitio_nombre})
                sitio_id = meta_sitio["_key"]
            else:
                sitio_id = list(sitio_doc)[0]["_key"]

        sitio_esp_id = None
        if sitio_especifico_nombre and sitio_id:
            sitio_esp_doc = sitios_esp_col.find({"nombre": sitio_especifico_nombre, "id_sitio": sitio_id})
            if sitio_esp_doc.empty():
                meta_sitio_esp = sitios_esp_col.insert({
                    "nombre": sitio_especifico_nombre,
                    "id_sitio": sitio_id
                })
                sitio_esp_id = meta_sitio_esp["_key"]
            else:
                sitio_esp_id = list(sitio_esp_doc)[0]["_key"]

        # ================== 5. Insertar muestra ==================
        muestras_col = db.collection("muestras")
        muestra_doc = {
            "id_analisis": analisis_id,
            "nombre_cepa": nombre_cepa,
            "estrategia_muestreo": estrategia_muestreo,
            "tipo_muestra": info_sitio.get("tipo_muestra"),
            "id_sitio": sitio_id,
            "id_sitio_especifico": sitio_esp_id,
            "profundidad": info_sitio.get("profundidad"),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        meta_muestra = muestras_col.insert(muestra_doc)
        muestra_id = meta_muestra["_key"]

        # ================== 6. Insertar secuencia ==================
        secuencias_col = db.collection("secuencias")
        secuencia_doc = {
            "id_muestra": muestra_id,
            "tratamiento": datos_secuencia.get("tratamiento"),
            "fenotipo1": datos_secuencia.get("fenotipo_1"),
            "fenotipo2": datos_secuencia.get("fenotipo_2"),
            "fenotipo3": datos_secuencia.get("fenotipo_3"),
            "secuencia": datos_secuencia.get("secuencia"),
            "longitud_secuencia": datos_secuencia.get("longitud_secuencia")
        }
        secuencias_col.insert(secuencia_doc)

        # ================== 7. Enlaces ==================
        enlaces_col = db.collection("enlaces")
        for tipo, url in {
            "imagen_cepa_pura": enlaces.get("imagenes_cepas_puras"),
            "imagen_muestreo": enlaces.get("imagenes_muestreo"),
            "ufc": enlaces.get("ufc"),
            "detalle": enlaces.get("detalle_muestreo")
        }.items():
            if url:
                enlaces_col.insert({
                    "id_analisis": analisis_id,
                    "tipo": tipo,
                    "url": url
                })

        return {"status": "success", "analisis_id": analisis_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# obtener todos los análisis de 18S
@router.get("/all")
def get_all_18s():
    try:
        analisis_col = db.collection("analisis")
        muestras_col = db.collection("muestras")
        secuencias_col = db.collection("secuencias")
        enlaces_col = db.collection("enlaces")
        sitios_col = db.collection("sitios")
        sitios_esp_col = db.collection("sitios_especificos")

        # ================== 1. Obtener todos los análisis de tipo 18s ==================
        analisis_docs = analisis_col.find({"type_form": "18s"})
        analisis_list = []

        for analisis in analisis_docs:
            analisis_id = analisis["_key"]

            # ================== 2. Buscar muestra asociada ==================
            muestra = muestras_col.find({"id_analisis": analisis_id})
            muestra_data = None
            secuencia_data = None
            if not muestra.empty():
                muestra_data = list(muestra)[0]

                # ================== 3. Buscar secuencia asociada ==================
                secuencia = secuencias_col.find({"id_muestra": muestra_data["_key"]})
                if not secuencia.empty():
                    secuencia_data = list(secuencia)[0]

                # ================== 4. Buscar sitio y sitio específico ==================
                sitio_data = None
                sitio_esp_data = None
                if muestra_data.get("id_sitio"):
                    sitio_doc = sitios_col.get(muestra_data["id_sitio"])
                    sitio_data = sitio_doc if sitio_doc else None

                if muestra_data.get("id_sitio_especifico"):
                    sitio_esp_doc = sitios_esp_col.get(muestra_data["id_sitio_especifico"])
                    sitio_esp_data = sitio_esp_doc if sitio_esp_doc else None

                # Agregar sitio al objeto de muestra
                muestra_data["sitio"] = sitio_data
                muestra_data["sitio_especifico"] = sitio_esp_data

            # ================== 5. Buscar enlaces ==================
            enlaces_docs = enlaces_col.find({"id_analisis": analisis_id})
            enlaces_list = [doc for doc in enlaces_docs]

            # ================== 6. Construir objeto final ==================
            analisis_list.append({
                **analisis,
                "muestra": muestra_data,
                "secuencia": secuencia_data,
                "enlaces": enlaces_list
            })

        return {"status": "success", "data": analisis_list}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
