import os
from fastapi import FastAPI
from arango import ArangoClient
from arango.exceptions import ServerConnectionError
from dotenv import load_dotenv
from routers import genomica

# Cargar las variables desde el archivo .env
load_dotenv()

# Leer variables del entorno
USERNAME = os.getenv("ARANGO_USERNAME")
PASSWORD = os.getenv("ARANGO_PASSWORD")
DB_NAME = os.getenv("ARANGO_DB")
CONFIG = os.getenv("CONFIGURED")
# if config es 0 entonces se crea la base de datos
if CONFIG == "0":
    client = ArangoClient()
    try:
        db = client.db(DB_NAME, username=USERNAME, password=PASSWORD)
        db.collections()
        print("✅ Conexión exitosa.")
        # EL INICIO DE LA BASE DE DATOS
        # ---------------------------------------------------------- Crear una colecciones
        # --- TABLAS
        collections_init = [
            "datos_Generales",
            "responsables"
        ]
        ## crear esas colecciones
        for collection_name in collections_init:
            if collection_name not in [col['name'] for col in db.collections()]:
                db.create_collection(collection_name)
                print(f"✅ Colección '{collection_name}' creada.")
            else:
                print(f"✅ Colección '{collection_name}' ya existe.")

    except ServerConnectionError as err:
        print(f"❌ No se pudo conectar al servidor de ArangoDB: {err}")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

app = FastAPI()

client = ArangoClient()

try:
    db = client.db(DB_NAME, username=USERNAME, password=PASSWORD)
    db.collections()
    print("✅ Conexión exitosa.")
except ServerConnectionError as err:
    print(f"❌ No se pudo conectar al servidor de ArangoDB: {err}")
except Exception as e:
    print(f"❌ Error inesperado: {e}")

# Incluir los routers
app.include_router(genomica.router)

@app.get("/")
def root():
    return {"mensaje": "API funcionando"}
