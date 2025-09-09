from pydantic import BaseModel

class LoginRequest(BaseModel):
    usuario: str
    password: str


class UserRequest(BaseModel):
    usuario: str
    password: str
    nombre: str
    apellido_paterno: str
    apellido_materno: str
    active: bool

class PasswordUpdateRequest(BaseModel):
    new_password: str
