import { useEffect, useMemo, useState } from "react";
import { Card, Form, Input, Button, Select, Typography, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import Particles, { initParticlesEngine } from "@tsparticles/react";
const { Title } = Typography;
const { Option } = Select;
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
const Home = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Valores del formulario:', values);
    //navigat
    navigate(values.tipoAnalisis); // Navega a la ruta correspondiente según el tipo de análisis
 
  };

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      // Evitar cambios innecesarios en el estado
    });
  }, []); // Solo se ejecuta una vez al montar el componente

  const particlesLoaded = (container) => {
    console.log(container);
  };

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "none",
        },
      },
      fpsLimit: 144,
      interactivity: {
        events: {
          onClick: {
            enable: false,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "grab",
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
          grab: {
            distance: 200,
          }
        },
      },
      particles: {
        color: {
          value: "#263057",
        },
        links: {
          color: "#263057",
          distance: 150,
          enable: true,
          opacity: 0.15,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: true,
          speed: 0.3,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 200,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    }),
    [] // Solo se crea una vez
  );

  const MemoizedParticles = useMemo(() => (
    <Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      options={options}
    />
  ), [options]);  // Dependiendo de `options`, pero no de `username` o `password`


  return (
    <Layout style={{
      width: '100vw', height: '100vh', margin: '-8px', padding: '0px', backgroundColor: 'none',
      backgroundColor: 'rgb(222, 222, 222)', // Fondo semi-transparente
      backdropFilter: 'blur(390px)', // Aplicar el desenfoque
      WebkitBackdropFilter: 'blur(500px)',
    }}>
      {MemoizedParticles}
      <div style={{ display: 'flex', justifyContent: 'center', justifyItems: 'center', alignItems: 'center',
        padding: '2rem', width: '100%', height: '100%', backgroundColor: 'rgba(218, 0, 0, 0)'}}>
      <Card
        title={<Title level={3} style={{ marginBottom: 0 }}>Menú</Title>}
        bordered={false}
        style={{ width: '100%', maxWidth: 400, height: '100%', maxHeight: 250 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="tipoAnalisis"
            label="Tipo de registro"
            rules={[{ required: true, message: 'Selecciona un tipo de registro' }]}
          >
            <Select placeholder="Selecciona un tipo">
              <Option value="genomica">Genómica</Option>
              <Option value="16s">16S</Option>
              <Option value="16s_articulo">16S Artículo</Option>
              <Option value="18s">18S</Option>
              <Option value="metagenomas">Metagenomas</Option>
              <Option value="its">ITS</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Continuar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
    </Layout>
  );
};

export default Home;
