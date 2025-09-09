// UserSession.js
class UserSession {
  constructor() {
    this.usuario = null;
    this.nombre = null;
    this.apellido_paterno = null;
    this.apellido_materno = null;
    this.token = null;
    this.rol = null;
  }

  setUser({ usuario, token, nombre = null, apellido_paterno = null, apellido_materno = null, rol = "usuario_normal" }) {
    this.usuario = usuario;
    this.nombre = nombre;
    this.apellido_paterno = apellido_paterno;
    this.apellido_materno = apellido_materno;
    this.token = token;
    this.rol = rol;

    // Guardar en localStorage
    localStorage.setItem("userSession", JSON.stringify({
      usuario: this.usuario,
      nombre: this.nombre,
      apellido_paterno: this.apellido_paterno,
      apellido_materno: this.apellido_materno,
      token: this.token,
      rol: this.rol
    }));
  }

  getUser() {
    if (!this.usuario) {
      const saved = localStorage.getItem("userSession");
      if (saved) {
        const data = JSON.parse(saved);
        this.setUser(data);
      }
    }
    return {
      usuario: this.usuario,
      nombre: this.nombre,
      apellido_paterno: this.apellido_paterno,
      apellido_materno: this.apellido_materno,
      token: this.token,
      rol: this.rol
    };
  }

  clearSession() {
    this.usuario = null;
    this.nombre = null;
    this.apellido_paterno = null;
    this.apellido_materno = null;
    this.token = null;
    this.rol = null;
    localStorage.removeItem("userSession");
  }
}

const userSession = new UserSession();
export default userSession;
