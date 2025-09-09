# initdb.py
from arango import ArangoClient
from arango.exceptions import (
    ServerConnectionError, 
    DatabaseCreateError, 
    CollectionCreateError, 
    DocumentInsertError
)
from dotenv import load_dotenv
import os
import bcrypt
from datetime import datetime, timezone

# Cargar variables de entorno
load_dotenv()
ARANGO_USERNAME = os.getenv("ARANGO_USERNAME")
ARANGO_PASSWORD = os.getenv("ARANGO_PASSWORD")
DB_NAME = os.getenv("DB_NAME")   # Nombre de la BD

print("Usuario:", ARANGO_USERNAME)
print("Password:", ARANGO_PASSWORD)
print("DB:", DB_NAME)

client = ArangoClient()

try:
    # Conectarse al servidor ArangoDB como root
    sys_db = client.db('_system', username=ARANGO_USERNAME, password=ARANGO_PASSWORD)

    # ⚠️ Borrar BD si ya existe
    if sys_db.has_database(DB_NAME):
        sys_db.delete_database(DB_NAME, ignore_missing=True)
        print(f"🗑️ Base de datos '{DB_NAME}' eliminada.")

    # Crear la base de datos
    sys_db.create_database(DB_NAME)
    print(f"✅ Base de datos '{DB_NAME}' creada exitosamente.")

    # Conectar a la base de datos recién creada
    db = client.db(DB_NAME, username=ARANGO_USERNAME, password=ARANGO_PASSWORD)

    # ----------------- Colecciones -----------------
    collections = [
        "usuarios", "analisis", "sitios", "sitios_especificos",
        "muestras", "secuencias", "administrativos",
        "identificadores_externos", "enlaces", "imagenes", "info_secuencias"
    ]

    created_collections = {}
    for col in collections:
        if db.has_collection(col):
            created_collections[col] = db.collection(col)
            print(f"✅ La colección '{col}' ya existe.")
        else:
            created_collections[col] = db.create_collection(col)
            print(f"✅ Colección '{col}' creada exitosamente.")

    usuarios = created_collections["usuarios"]
    analisis = created_collections["analisis"]
    sitios = created_collections["sitios"]
    sitios_especificos = created_collections["sitios_especificos"]
    muestras = created_collections["muestras"]
    secuencias = created_collections["secuencias"]
    administrativos = created_collections["administrativos"]
    identificadores_externos = created_collections["identificadores_externos"]
    enlaces = created_collections["enlaces"]
    imagenes = created_collections["imagenes"]
    info_secuencias = created_collections["info_secuencias"]

    # ----------------- Índices -----------------
    if not any(idx["type"] == "persistent" and idx["fields"] == ["usuario"] for idx in usuarios.indexes()):
        usuarios.add_persistent_index(fields=["usuario"], unique=True)
        print("✅ Índice único en 'usuario' creado.")

    # ----------------- Documentos de prueba -----------------
    hashed_pw = bcrypt.hashpw("test123".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    test_user = {
        "_key": "test_user",
        "usuario": "test_user",
        "password_hash": hashed_pw,
        "nombre": "Test",
        "apellido_p": "Usuario",
        "apellido_m": "Prueba",
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    sitio_doc = {"_key": "sitio_test", "nombre": "Sitio Ejemplo"}
    sitio_especifico_doc = {"_key": "sitio_esp_test", "id_sitio": "sitio_test", "nombre": "Subsitio Ejemplo"}
    analisis_doc = {
        "_key": "analisis_test",
        "tipo": "metagenomica",
        "fecha": datetime.now().date().isoformat(),
        "id_usuario": "test_user",
        "link_auxiliar": "/archivos/test",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    muestra_doc = {
        "_key": "muestra_test",
        "id_analisis": "analisis_test",
        "codigo_muestra": "M001",
        "genero": "Bacteria",
        "numero_cepario_gob": "GOB123",
        "tipo_muestra": "Suelo",
        "caracteristicas": "Oscuro, húmedo",
        "id_sitio": "sitio_test",
        "id_sitio_especifico": "sitio_esp_test",
        "profundidad": "10cm",
        "estrategia_muestreo": "Aleatorio",
        "nombre_cepa": "CepaTest",
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    try:
        usuarios.insert(test_user)
        sitios.insert(sitio_doc)
        sitios_especificos.insert(sitio_especifico_doc)
        analisis.insert(analisis_doc)
        muestras.insert(muestra_doc)

        print("✅ Documentos de prueba insertados correctamente.")

        # ----------------- Borrar documentos de prueba -----------------
        usuarios.delete("test_user")
        sitios_especificos.delete("sitio_esp_test")
        sitios.delete("sitio_test")
        muestras.delete("muestra_test")
        analisis.delete("analisis_test")
        print("🗑️ Documentos de prueba eliminados correctamente.")

    except DocumentInsertError:
        print("⚠️ Algunos documentos de prueba ya existían.")

except ServerConnectionError as err:
    print(f"❌ No se pudo conectar al servidor de ArangoDB: {err}")

except DatabaseCreateError as err:
    print(f"❌ Error al crear la base de datos: {err}")

except CollectionCreateError as err:
    print(f"❌ Error al crear la colección: {err}")

except Exception as e:
    print(f"❌ Error inesperado: {e}")
