import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Form, Input, Modal, Switch, Spin, Typography, Space } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import BACKEND_URL from "../../../config/backend";
import userSession from "../../../config/Sessions";

const PanelUser = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [usuarioExistente, setUsuarioExistente] = useState(false);
  const [pageSize, setPageSize] = useState(10);
const [usuarioInput, setUsuarioInput] = useState("");
  // -------------------------------
  // Fetch con token
  // -------------------------------
  const authFetch = async (url, options = {}) => {
    const session = userSession.getUser();
    if (!session || !session.token) {
      userSession.clearSession();
      navigate("/");
      return null;
    }
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${session.token}`,
      "Content-Type": "application/json",
    };
    const resp = await fetch(url, { ...options, headers });
    if (resp.status === 401) {
      userSession.clearSession();
      Swal.fire("Sesión expirada", "Por favor inicia sesión nuevamente", "warning");
      navigate("/");
      return null;
    }
    return resp;
  };

  // -------------------------------
  // Validar sesión
  // -------------------------------
  useEffect(() => {
    const validateSession = async () => {
      const session = userSession.getUser();
      if (!session || !session.token) {
        navigate("/");
        return;
      }
      if (session.rol !== "super_usuario") {
        Swal.fire("Acceso denegado", "No tienes permisos para entrar aquí", "error");
        navigate("/");
        return;
      }
      await fetchUsers();
      setCheckingSession(false);
    };
    validateSession();
  }, []);

  // -------------------------------
  // Obtener usuarios
  // -------------------------------
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await authFetch(`${BACKEND_URL}/auth/list_users`);
      if (!response) return;
      const data = await response.json();
      if (data.success) setUsers(data.usuarios);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error al obtener usuarios", "error");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // Modal agregar/editar
  // -------------------------------
  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setUsuarioExistente(false);
    setModalVisible(true);
  };
  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({ password: "" });
    setModalVisible(true);
  };

  // -------------------------------
  // Verificar usuario existente
  // -------------------------------
  const checkUsuario = async (usuario) => {
    if (!usuario) return;
    const exists = users.some((u) => u.usuario.toLowerCase() === usuario.toLowerCase());
    setUsuarioExistente(exists);
  };

  // -------------------------------
  // Insertar usuario
  // -------------------------------
  const insertUser = async (values) => {
    if (usuarioExistente) return;
    try {
      const response = await authFetch(`${BACKEND_URL}/auth/insert_user`, {
        method: "POST",
        body: JSON.stringify({ ...values, active: true }),
      });
      if (!response) return;
      const data = await response.json();
      if (data.success) {
        Swal.fire("Éxito", data.mensaje, "success");
        fetchUsers();
        setModalVisible(false);
      } else {
        Swal.fire("Error", data.mensaje, "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo insertar el usuario", "error");
    }
  };

  // -------------------------------
  // Cambiar password
  // -------------------------------
  const updatePassword = async (usuario, password) => {
    try {
      const response = await authFetch(`${BACKEND_URL}/auth/update_password/${usuario}`, {
        method: "PUT",
        body: JSON.stringify({ new_password: password }),
      });
      if (!response) return;
      const data = await response.json();
      if (data.success) {
        Swal.fire("Éxito", data.mensaje, "success");
        fetchUsers();
        setModalVisible(false);
      } else {
        Swal.fire("Error", data.mensaje, "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo cambiar la contraseña", "error");
    }
  };

  // -------------------------------
  // Activar / desactivar usuario
  // -------------------------------
  const toggleActive = async (usuario, active) => {
    try {
      const url = active
        ? `${BACKEND_URL}/auth/deactivate_user/${usuario}`
        : `${BACKEND_URL}/auth/activate_user/${usuario}`;
      const response = await authFetch(url, { method: "PUT" });
      if (!response) return;
      const data = await response.json();
      if (data.success) {
        Swal.fire("Éxito", data.mensaje, "success");
        fetchUsers();
      } else {
        Swal.fire("Error", data.mensaje, "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo actualizar el usuario", "error");
    }
  };

  // -------------------------------
  // Submit form
  // -------------------------------
  const handleSubmit = (values) => {
    if (editingUser) {
      updatePassword(editingUser.usuario, values.password);
    } else {
      insertUser(values);
    }
  };

  // -------------------------------
  // Columnas tabla
  // -------------------------------
  const columns = [
    { title: "Usuario", dataIndex: "usuario", key: "usuario" },
    { title: "Nombre", dataIndex: "nombre", key: "nombre" },
    { title: "Apellido Paterno", dataIndex: "apellido_paterno", key: "apellido_paterno" },
    { title: "Apellido Materno", dataIndex: "apellido_materno", key: "apellido_materno" },
    {
      title: "Activo",
      key: "active",
      render: (_, record) => (
        <Switch checked={record.active} onChange={() => toggleActive(record.usuario, record.active)} />
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
      ),
    },
  ];

  const filteredUsers = users.filter(
    (u) =>
      u.usuario.toLowerCase().includes(searchText.toLowerCase()) ||
      u.nombre.toLowerCase().includes(searchText.toLowerCase())
  );

  // -------------------------------
  // Calcular pageSize dinámico
  // -------------------------------
  useEffect(() => {
    const calculatePageSize = () => {
      if (!containerRef.current) return;
      const containerHeight = containerRef.current.clientHeight;
      const headerHeight = 80;
      const rowHeight = 54;
      const footerHeight = 64;
      const newPageSize = Math.floor((containerHeight - headerHeight - footerHeight) / rowHeight);
      setPageSize(newPageSize);
    };
    calculatePageSize();
    window.addEventListener("resize", calculatePageSize);
    return () => window.removeEventListener("resize", calculatePageSize);
  }, [users]);

  if (checkingSession) {
    return (
      <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Spin size="large" tip="Validando sesión..." />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f7f7f7 0%, #e2e2e2 100%)",
        padding: 24
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: 1200,
          height: "90vh",
          backgroundColor: "#fff",
          padding: 24,
          borderRadius: 16,
          boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease"
        }}
      >
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Input
            placeholder="Buscar usuario o nombre"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: 300,
              borderRadius: 12,
              borderColor: "#d9d9d9",
              transition: "all 0.3s ease",
            }}
            onFocus={e => e.currentTarget.style.borderColor = "#5b5b5b"}
            onBlur={e => e.currentTarget.style.borderColor = "#d9d9d9"}
          />
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ borderRadius: 12 }}>
              Agregar Usuario
            </Button>
            <Button danger onClick={() => { userSession.clearSession(); navigate("/"); }} style={{ borderRadius: 12 }}>
              Cerrar sesión
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers.map(u => ({ ...u, key: u._key }))}
          loading={loading}
          pagination={{ pageSize, position: ["bottomCenter"] }}
          scroll={{ y: "65vh" }}
          bordered={false}
          style={{ borderRadius: 12 }}
        />

        <Modal
          visible={modalVisible}
          title={editingUser ? "Cambiar Contraseña" : "Agregar Usuario"}
          onCancel={() => setModalVisible(false)}
          onOk={() => form.submit()}
          centered
          okButtonProps={{
  disabled: !editingUser && (usuarioExistente || !usuarioInput)
}}

        >
          <Form
  form={form}
  layout="vertical"
  onFinish={handleSubmit}
  onValuesChange={(changedValues) => {
    if (changedValues.usuario !== undefined) {
      setUsuarioInput(changedValues.usuario);
      checkUsuario(changedValues.usuario);
    }
  }}
>
            {!editingUser && (
              <>
                <Form.Item name="usuario" label="Usuario" rules={[{ required: true, message: "Ingrese el usuario" }]}>
                  <Input placeholder="Ingrese usuario" style={{ borderRadius: 12 }} />
                </Form.Item>
                {usuarioExistente && <div style={{ color: "red" }}>Este usuario ya existe</div>}
                <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: "Ingrese el nombre" }]}>
                  <Input placeholder="Ingrese nombre" style={{ borderRadius: 12 }} />
                </Form.Item>
                <Form.Item name="apellido_paterno" label="Apellido Paterno" rules={[{ required: true, message: "Ingrese el apellido paterno" }]}>
                  <Input placeholder="Ingrese apellido paterno" style={{ borderRadius: 12 }} />
                </Form.Item>
                <Form.Item name="apellido_materno" label="Apellido Materno" rules={[{ required: true, message: "Ingrese el apellido materno" }]}>
                  <Input placeholder="Ingrese apellido materno" style={{ borderRadius: 12 }} />
                </Form.Item>
              </>
            )}
            <Form.Item
  name="password"
  label={editingUser ? "Nueva Contraseña" : "Contraseña"}
  rules={[
    { required: true, message: "Ingrese la contraseña" },
    {
      pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/,
      message: "La contraseña debe tener mínimo 8 caracteres, al menos un número y un carácter especial (!@#$%^&*)",
    },
  ]}
  hasFeedback
>
  <Input
    type="password"
    placeholder="Ingrese contraseña segura"
    style={{
      borderRadius: 12,
      borderColor: "#d9d9d9",
      transition: "all 0.3s ease",
    }}
    onFocus={(e) => (e.target.style.borderColor = "#5b5b5b")}
    onBlur={(e) => (e.target.style.borderColor = "#d9d9d9")}
    prefix
  />
</Form.Item>

          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default PanelUser;
