from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from arango import ArangoClient
from arango.exceptions import DocumentInsertError
import bcrypt
from dotenv import load_dotenv
from datetime import datetime, timezone
import os

# 👇 Importar modelos desde models/user.py
from models.user import LoginRequest, UserRequest, PasswordUpdateRequest
from utils.token import create_token
from utils.auth_dependency import verify_superuser  # Solo superusuario

load_dotenv()

router = APIRouter(prefix="/auth", tags=["auth"])

# Usuario superusuario
user = os.getenv("SUPERUSER_WEB")
password = os.getenv("SUPERUSER_PASSWORD")

# Credenciales de Arango
ARANGO_USERNAME = os.getenv("ARANGO_USERNAME")
ARANGO_PASSWORD = os.getenv("ARANGO_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# Conexión a Arango
client = ArangoClient()
db = client.db(DB_NAME, username=ARANGO_USERNAME, password=ARANGO_PASSWORD)
usuarios = db.collection("usuarios")


# --- Login normal y superusuario (no protegidos) ---
@router.post("/login")
def login(data: LoginRequest):
    try:
        user_doc = usuarios.get(data.usuario)
        if not user_doc:
            return JSONResponse({"success": False, "mensaje": "Usuario no encontrado"}, status_code=404)

        if not user_doc.get("active", False):
            return JSONResponse({"success": False, "mensaje": "Usuario desactivado"}, status_code=403)

        hashed_pw = user_doc["password"].encode("utf-8")
        if not bcrypt.checkpw(data.password.encode("utf-8"), hashed_pw):
            return JSONResponse({"success": False, "mensaje": "Contraseña incorrecta"}, status_code=401)

        token = create_token({"usuario": user_doc["usuario"], "rol": "usuario_normal"})
        user_info = {
            "usuario": user_doc["usuario"],
            "nombre": user_doc.get("nombre"),
            "apellido_paterno": user_doc.get("apellido_paterno"),
            "apellido_materno": user_doc.get("apellido_materno"),
            "rol": "usuario_normal"
        }

        return JSONResponse(
            content={"success": True, "mensaje": "Login exitoso", "usuario": user_info, "token": token},
            status_code=200
        )

    except Exception as e:
        return JSONResponse({"success": False, "mensaje": f"Error inesperado: {str(e)}"}, status_code=500)


@router.post("/superuser_login")
def superuser_login(data: LoginRequest):
    if data.usuario == user and data.password == password:
        token = create_token({"usuario": data.usuario, "rol": "super_usuario"})
        return JSONResponse(
            content={
                "success": True,
                "mensaje": "Login superusuario exitoso",
                "usuario": {"usuario": data.usuario},
                "token": token,
                "rol": "super_usuario"
            },
            status_code=200
        )

    return JSONResponse(
        content={"success": False, "mensaje": "Credenciales de superusuario inválidas"},
        status_code=401,
    )


# --- Endpoints protegidos solo para superusuario ---
@router.post("/insert_user")
def insert_user(data: UserRequest, payload: dict = Depends(verify_superuser)):
    try:
        hashed_pw = bcrypt.hashpw(data.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        user_doc = {
            "_key": data.usuario,
            "usuario": data.usuario,
            "password": hashed_pw,
            "nombre": data.nombre,
            "apellido_paterno": data.apellido_paterno,
            "apellido_materno": data.apellido_materno,
            "active": data.active,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        usuarios.insert(user_doc)
        return JSONResponse({"success": True, "mensaje": f"Usuario '{data.usuario}' insertado correctamente"}, status_code=201)
    except DocumentInsertError as e:
        if "unique constraint violated" in str(e).lower():
            return JSONResponse({"success": False, "mensaje": f"El usuario '{data.usuario}' ya existe"}, status_code=400)
        return JSONResponse({"success": False, "mensaje": f"Error de inserción: {str(e)}"}, status_code=400)
    except Exception as e:
        return JSONResponse({"success": False, "mensaje": f"Error inesperado: {str(e)}"}, status_code=500)


@router.get("/get_user/{usuario}")
def get_user(usuario: str, payload: dict = Depends(verify_superuser)):
    try:
        user_doc = usuarios.get(usuario)
        if not user_doc:
            return JSONResponse({"success": False, "mensaje": f"Usuario '{usuario}' no encontrado"}, status_code=404)
        user_doc.pop("password", None)
        return JSONResponse({"success": True, "usuario": user_doc}, status_code=200)
    except Exception as e:
        return JSONResponse({"success": False, "mensaje": f"Error inesperado: {str(e)}"}, status_code=500)


@router.get("/list_users")
def list_users(payload: dict = Depends(verify_superuser)):
    try:
        users = [doc for doc in usuarios.all()]
        for u in users:
            u.pop("password", None)
        return JSONResponse({"success": True, "usuarios": users}, status_code=200)
    except Exception as e:
        return JSONResponse({"success": False, "mensaje": f"Error inesperado: {str(e)}"}, status_code=500)


@router.get("/list_active_users")
def list_active_users(payload: dict = Depends(verify_superuser)):
    try:
        query = f"FOR u IN {usuarios.name} FILTER u.active == true RETURN u"
        active_users = [doc for doc in db.aql.execute(query)]
        for u in active_users:
            u.pop("password", None)
        return JSONResponse({"success": True, "usuarios": active_users}, status_code=200)
    except Exception as e:
        return JSONResponse({"success": False, "mensaje": f"Error inesperado: {str(e)}"}, status_code=500)


@router.put("/deactivate_user/{usuario}")
def deactivate_user(usuario: str, payload: dict = Depends(verify_superuser)):
    try:
        user_doc = usuarios.get(usuario)
        if not user_doc:
            return JSONResponse({"success": False, "mensaje": f"Usuario '{usuario}' no encontrado"}, status_code=404)
        user_doc["active"] = False
        usuarios.update(user_doc)
        return JSONResponse({"success": True, "mensaje": f"Usuario '{usuario}' desactivado"}, status_code=200)
    except Exception as e:
        return JSONResponse({"success": False, "mensaje": f"Error inesperado: {str(e)}"}, status_code=500)


@router.put("/activate_user/{usuario}")
def activate_user(usuario: str, payload: dict = Depends(verify_superuser)):
    try:
        user_doc = usuarios.get(usuario)
        if not user_doc:
            return JSONResponse({"success": False, "mensaje": f"Usuario '{usuario}' no encontrado"}, status_code=404)
        user_doc["active"] = True
        usuarios.update(user_doc)
        return JSONResponse({"success": True, "mensaje": f"Usuario '{usuario}' activado"}, status_code=200)
    except Exception as e:
        return JSONResponse({"success": False, "mensaje": f"Error inesperado: {str(e)}"}, status_code=500)


@router.put("/update_password/{usuario}")
def update_password(usuario: str, data: PasswordUpdateRequest, payload: dict = Depends(verify_superuser)):
    try:
        user_doc = usuarios.get(usuario)
        if not user_doc:
            return JSONResponse({"success": False, "mensaje": f"Usuario '{usuario}' no encontrado"}, status_code=404)
        hashed_pw = bcrypt.hashpw(data.new_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        user_doc["password"] = hashed_pw
        user_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
        usuarios.update(user_doc)
        return JSONResponse({"success": True, "mensaje": f"Contraseña de '{usuario}' actualizada correctamente"}, status_code=200)
    except Exception as e:
        return JSONResponse({"success": False, "mensaje": f"Error inesperado: {str(e)}"}, status_code=500)
