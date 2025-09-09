import os
from fastapi import FastAPI
# from arango import ArangoClient
# from arango.exceptions import ServerConnectionError
from dotenv import load_dotenv
from routers import genomica, auth, XVIs, XVIS_Articulo, XVIIIs, metagenomas, its
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

# Cargar las variables desde el archivo .env
load_dotenv()

# Leer variables del entorno
USERNAME = os.getenv("ARANGO_USERNAME")
PASSWORD = os.getenv("ARANGO_PASSWORD")
DB_NAME = os.getenv("ARANGO_DB")
CONFIG = os.getenv("CONFIGURED")

# if config es 0 entonces se crea la base de datos
# if CONFIG == "0":
#     client = ArangoClient()
#     try:
#         db = client.db(DB_NAME, username=USERNAME, password=PASSWORD)
#         db.collections()
#         print("✅ Conexión exitosa.")
#         collections_init = [
#             "datos_Generales",
#             "responsables"
#         ]
#         for collection_name in collections_init:
#             if collection_name not in [col['name'] for col in db.collections()]:
#                 db.create_collection(collection_name)
#                 print(f"✅ Colección '{collection_name}' creada.")
#             else:
#                 print(f"✅ Colección '{collection_name}' ya existe.")
#     except ServerConnectionError as err:
#         print(f"❌ No se pudo conectar al servidor de ArangoDB: {err}")
#     except Exception as e:
#         print(f"❌ Error inesperado: {e}")

app = FastAPI()
origins = [
    "http://localhost:5173",  # URL donde corre tu React
    # Puedes añadir más orígenes si quieres permitirlos
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Montar carpeta 'archivos' para que sea accesible públicamente
app.mount("/archivos", StaticFiles(directory="archivos"), name="archivos")

# client = ArangoClient()
# try:
#     db = client.db(DB_NAME, username=USERNAME, password=PASSWORD)
#     db.collections()
#     print("✅ Conexión exitosa.")
# except ServerConnectionError as err:
#     print(f"❌ No se pudo conectar al servidor de ArangoDB: {err}")
# except Exception as e:
#     print(f"❌ Error inesperado: {e}")

# Montar carpeta 'archivos' para que sea accesible públicamente
app.mount("/archivos", StaticFiles(directory="archivos"), name="archivos")

# Incluir los routers
app.include_router(genomica.router)
app.include_router(auth.router)
app.include_router(XVIs.router)
app.include_router(XVIS_Articulo.router)
app.include_router(XVIIIs.router)
app.include_router(metagenomas.router)
app.include_router(its.router)

@app.get("/")
def root():
    return {"mensaje": "API funcionando"}

@app.get("/api/listar/{ruta:path}")
def listar_archivos(ruta: str):
    base_path = os.path.join("archivos", ruta)
    if os.path.exists(base_path) and os.path.isdir(base_path):
        archivos = os.listdir(base_path)
        archivos_completos = [
            {"nombre": archivo, "url": f"/archivos/{ruta}/{archivo}"}
            for archivo in archivos
        ]
        return JSONResponse(content=archivos_completos)
    return JSONResponse(content={"error": "Ruta no válida"}, status_code=404)

@app.get("/api/descargar/{ruta:path}")
def descargar_archivo(ruta: str):
    file_path = os.path.join("archivos", ruta)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(
            file_path,
            media_type="application/octet-stream",
            filename=os.path.basename(file_path),
        )
    return JSONResponse({"error": "Archivo no encontrado"}, status_code=404)
