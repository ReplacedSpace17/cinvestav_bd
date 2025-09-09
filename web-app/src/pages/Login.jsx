import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  Switch,
  Space,
  App
} from "antd";
import { LockOutlined, UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import Swal from "sweetalert2";
import "antd/dist/reset.css";
import BACKEND_URL from "../../config/backend";
import { useNavigate } from "react-router-dom";
import userSession from "../../config/Sessions";

const LoginPage = () => {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [superUser, setSuperUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const endpoint = superUser ? "/auth/superuser_login" : "/auth/login";
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);
      if (data.success) {
        if (superUser) {
          userSession.setUser({
            usuario: values.usuario,
            token: data.token || "superuser_dummy_token",
            rol: "super_usuario"
          });
          navigate("/panel-user");
        } else {
          userSession.setUser({
            usuario: data.usuario.usuario,
            nombre: data.usuario.nombre,
            apellido_paterno: data.usuario.apellido_paterno,
            apellido_materno: data.usuario.apellido_materno,
            token: data.token || "user_dummy_token",
            rol: "usuario_normal"
          });
          

          navigate("/menu");
        }

        Swal.fire({
          icon: "success",
          title: "Inicio de sesión exitoso",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.mensaje || "Credenciales inválidas",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al iniciar sesión",
      });
      console.error("Error al iniciar sesión:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f7f7f7 0%, #e2e2e2 100%)",
        animation: "fadeIn 1s ease",
      }}
    >
      <Card
        bordered={false}
        style={{
          width: 420,
          padding: 40,
          borderRadius: 20,
          boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
          backgroundColor: "#ffffff",
          transition: "all 0.3s ease",
        }}
      >
        <Space direction="vertical" size={12} style={{ width: "100%", textAlign: "center" }}>
          <Typography.Title level={3} style={{ margin: 0, color: "#333" }}>
            NOmbre aqui
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 14 }}>
            Accede a tu cuenta
          </Typography.Text>
        </Space>

        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 24 }}
          requiredMark={false}
        >
          <Form.Item
            label="Usuario"
            name="usuario"
            rules={[{ required: true, message: "Ingrese su usuario" }]}
          >
            <Input
              size="large"
              prefix={<UserOutlined style={{ color: "#888" }} />}
              placeholder="usuario"
              autoComplete="username"
              style={{
                borderRadius: 12,
                borderColor: "#d9d9d9",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#5b5b5b")}
              onBlur={(e) => (e.target.style.borderColor = "#d9d9d9")}
            />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: "Ingrese su contraseña" }]}
          >
<Input
  size="large"
  prefix={<LockOutlined style={{ color: "#888" }} />}
  placeholder="••••••••"
  type="password"
  autoComplete="current-password"
  style={{
    borderRadius: 12,
    borderColor: "#d9d9d9",
    transition: "all 0.3s ease",
  }}
  onFocus={(e) => (e.target.style.borderColor = "#5b5b5b")}
  onBlur={(e) => (e.target.style.borderColor = "#d9d9d9")}
/>



          </Form.Item>

          <Form.Item>
            <Switch checked={superUser} onChange={setSuperUser} />
            <span style={{ marginLeft: 8, fontSize: 14, color: "#555" }}>Super usuario</span>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{
                borderRadius: 12,
                background: "linear-gradient(90deg, #5b5b5b, #3d3d3d)",
                borderColor: "#3d3d3d",
                fontWeight: 500,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(90deg, #3d3d3d, #5b5b5b)"}
              onMouseLeave={e => e.currentTarget.style.background = "linear-gradient(90deg, #5b5b5b, #3d3d3d)"}
            >
              Acceder
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default LoginPage;
