# utils/auth_dependency.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "mi_clave_secreta")
ALGORITHM = "HS256"

# Seguridad con bearer token
bearer_scheme = HTTPBearer()

def verify_superuser(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    """
    Verifica que el token sea válido y que el usuario sea superusuario.
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("rol") != "super_usuario":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acceso denegado: solo superusuario permitido"
            )
        return payload  # puedes usar info del token en el endpoint si lo deseas
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expirado"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )
