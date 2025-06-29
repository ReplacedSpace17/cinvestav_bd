

//escuelas
{
  "_key": "esc1",
  "nombre": "Escuela Nacional de Ciencias",
  "tipo": "Escolarizada",         // o "No escolarizada"
  "direccion": "Av. Universidad 123"
}
//estudiantes
{
  "_key": "est1",
  "nombre": "Luis García",
  "edad": 21,
  "calificacion": 87,
  "escuela_id": "esc1"
}


from arango import ArangoClient

# Crear cliente
client = ArangoClient()

# Conectar como root
sys_db = client.db('_system', username='root', password='tu_password')

# Crear base de datos si no existe
if not sys_db.has_database('educacion_db'):
    sys_db.create_database('educacion_db')

# Conectar a la nueva base
db = client.db('educacion_db', username='root', password='tu_password')

# Crear colecciones si no existen
for col in ['escuelas', 'estudiantes']:
    if not db.has_collection(col):
        db.create_collection(col)

# Insertar datos de ejemplo
escuelas = db.collection('escuelas')
if not escuelas.has('esc1'):
    escuelas.insert({
        '_key': 'esc1',
        'nombre': 'Escuela Nacional de Ciencias',
        'tipo': 'Escolarizada',
        'direccion': 'Av. Universidad 123'
    })

estudiantes = db.collection('estudiantes')
if not estudiantes.has('est1'):
    estudiantes.insert({
        '_key': 'est1',
        'nombre': 'Luis García',
        'edad': 21,
        'calificacion': 87,
        'escuela_id': 'esc1'
    })

print("Base de datos y colecciones creadas correctamente.")
