python -m venv backend
source backend/bin/activate

#instalar arango
docker run -e ARANGO_ROOT_PASSWORD=Javier117 \
  -p 8529:8529 \
  -v arangodb_data:/var/lib/arangodb3 \
  --name arangodb \
  -d arangodb:latest

docker start arangodb

docker ps
pedir el /db  en el nginx http://localhost:8529
crear el .env con los valores
ejecutar el init para la db, initDB.py para crear la bd en arango

