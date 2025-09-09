# delete.py
import os
from arango import ArangoClient
from dotenv import load_dotenv

# ================== 1. Cargar variables de entorno ==================
load_dotenv()
ARANGO_USERNAME = os.getenv("ARANGO_USERNAME")
ARANGO_PASSWORD = os.getenv("ARANGO_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# ================== 2. Conectar a ArangoDB ==================
client = ArangoClient()
db = client.db(DB_NAME, username=ARANGO_USERNAME, password=ARANGO_PASSWORD)

# ================== 3. Definir colecciones a limpiar ==================
colecciones_a_limpiar = [
    "analisis",
    "muestras",
    "secuencias",
    "administrativos",
    "identificadores_externos",
    "enlaces",
    "sitios",
    "sitios_especificos",
    "imagenes",
    "info_secuencias"
    
]

# ================== 4. Limpiar las colecciones ==================
for col_name in colecciones_a_limpiar:
    col = db.collection(col_name)
    print(f"Limpiando colección: {col_name}")
    col.truncate()  # Borra todos los documentos de la colección

print("✅ Todas las colecciones fueron vaciadas (usuarios intactos).")
