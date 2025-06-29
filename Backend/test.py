from arango import ArangoClient
from arango.exceptions import ServerConnectionError
from datetime import datetime
import uuid

client = ArangoClient()

try:
    db = client.db('Example', username='backend_user', password='Javier117')
    collections = db.collections()
    print("✅ Conexión exitosa.")

    # Asegurar colección de ciudades
    city_collection_name = "cities"
    if city_collection_name not in [col['name'] for col in collections]:
        city_collection = db.create_collection(city_collection_name)
        print(f"✅ Colección '{city_collection_name}' creada.")
    else:
        city_collection = db.collection(city_collection_name)

    # Asegurar que la ciudad existe
    city_key = "new_york"
    city_id = f"{city_collection_name}/{city_key}"
    if not city_collection.has(city_key):
        city_collection.insert({"_key": city_key, "name": "New York"})
        print("🏙️ Ciudad 'New York' insertada.")

    # Asegurar colección principal
    collection_name = "my_collection"
    if collection_name not in [col['name'] for col in collections]:
        collection = db.create_collection(collection_name)
        print(f"✅ Colección '{collection_name}' creada.")
    else:
        collection = db.collection(collection_name)

    # Insertar documento con referencia a la ciudad
    document = {
        "date": datetime.now().isoformat(),
        "name": "John Doe",
        "age": 30,
        "city": city_id  # Referencia a city
    }

    collection.insert(document)
    print("✅ Documento insertado correctamente.")

except ServerConnectionError as err:
    print(f"❌ No se pudo conectar al servidor de ArangoDB: {err}")
except Exception as e:
    print(f"❌ Error inesperado: {e}")
