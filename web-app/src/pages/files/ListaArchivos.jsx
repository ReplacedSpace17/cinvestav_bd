import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import {
  Typography,
  Card,
  Row,
  Col,
  Button,
  message,
  Spin,
} from 'antd';
import {
  EyeOutlined,
  DownloadOutlined,
  FileOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

function ListaArchivos() {
  const location = useLocation();
  const ruta = decodeURIComponent(location.pathname.replace('/lista-archivos/', ''));
  const [archivos, setArchivos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArchivos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/listar/${ruta}`);
        setArchivos(response.data);
      } catch (error) {
        console.error("Error al obtener archivos", error);
        message.error("No se pudo cargar la lista de archivos.");
      } finally {
        setLoading(false);
      }
    };
    if (ruta) fetchArchivos();
  }, [ruta]);

  const descargarArchivo = (rutaArchivo, nombre) => {
    const url = `http://localhost:8000/api/descargar/${rutaArchivo}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const esImagen = (nombre) => {
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(nombre);
  };

  return (
    <div
      style={{
        padding: 32,
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #f0f2f5 0%, #d6e4ff 100%)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
          Archivos en: <Text code>{ruta}</Text>
        </Title>

        {loading ? (
          <div style={{ textAlign: 'center', marginTop: 100 }}>
            <Spin size="large" tip="Cargando archivos..." />
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {archivos.length > 0 ? (
              archivos.map((archivo) => (
                <Col xs={24} sm={12} md={8} lg={6} key={archivo.nombre}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: 16,
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                    cover={
                      esImagen(archivo.nombre) ? (
                        <img
                          alt={archivo.nombre}
                          src={`http://localhost:8000${archivo.url}`}
                          style={{
                            objectFit: 'cover',
                            height: 160,
                            width: '100%',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            height: 160,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#fafafa',
                            fontSize: 48,
                            color: '#999',
                          }}
                        >
                          <FileOutlined />
                        </div>
                      )
                    }
                    actions={[
                      <a
                        href={`http://localhost:8000${archivo.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Ver ${archivo.nombre}`}
                      >
                        <EyeOutlined key="view" />
                      </a>,
                      <DownloadOutlined
                        key="download"
                        onClick={() =>
                          descargarArchivo(`${ruta}/${archivo.nombre}`, archivo.nombre)
                        }
                      />,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <Text ellipsis style={{ width: '100%', display: 'inline-block' }}>
                          {archivo.nombre}
                        </Text>
                      }
                    />
                  </Card>
                </Col>
              ))
            ) : (
              <Col span={24}>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  No hay archivos disponibles.
                </Text>
              </Col>
            )}
          </Row>
        )}
      </div>
    </div>
  );
}

export default ListaArchivos;
