from arango import ArangoClient
from arango.exceptions import ServerConnectionError

# Crear cliente
client = ArangoClient()

try:
    # Conexión a la base de datos
    db = client.db('Example', username='backend_user', password='Javier117')

    # Nombre de la colección
    collection_name = "my_collection"
    
    # Obtener la colección (ya debe existir)
    if db.has_collection(collection_name):
        collection = db.collection(collection_name)
    else:
        raise Exception(f"La colección '{collection_name}' no existe.")
    
    # Obtener todos los documentos
    print(f"📄 Documentos en la colección '{collection_name}':")
    for doc in collection.all():
        print(doc)

except ServerConnectionError as err:
    print(f"❌ No se pudo conectar al servidor de ArangoDB: {err}")

except Exception as e:
    print(f"❌ Error inesperado: {e}")
