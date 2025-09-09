import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Steps, message } from 'antd';
const { Title } = Typography;
const { Step } = Steps;

const ExampleForm = () => {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const next = async () => {
    try {
      // valida solo los campos del paso actual
      await form.validateFields(steps[current].fields);
      setCurrent(current + 1);
    } catch (err) {
      console.log('Errores de validación:', err);
    }
  };

  const prev = () => setCurrent(current - 1);

  const onFinish = async (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // mostramos todos los valores juntos
      console.log('Formulario completo:', JSON.stringify(values, null, 2));
      if (values.username === 'admin' && values.password === '123456') {
        message.success('¡Login exitoso!');
      } else {
        message.error('Usuario o contraseña incorrectos');
      }
    }, 1000);
  };

  const steps = [
    {
      title: 'Usuario',
      fields: ['username'],
      content: (
        <Form.Item
          label="Usuario"
          name="username"
          rules={[{ required: true, message: 'Por favor ingresa tu usuario' }]}
        >
          <Input placeholder="Usuario" />
        </Form.Item>
      ),
    },
    {
      title: 'Contraseña',
      fields: ['password'],
      content: (
        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
        >
          <Input.Password placeholder="Contraseña" />
        </Form.Item>
      ),
    },
  ];

  return (
    <Card style={{ maxWidth: 400, margin: '5rem auto', textAlign: 'center' }}>
      <Title level={3}>Iniciar Sesión</Title>
      <Steps current={current} style={{ marginBottom: 24 }}>
        {steps.map((step, index) => (
          <Step key={index} title={step.title} />
        ))}
      </Steps>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        {steps.map((step, index) => (
          <div key={index} style={{ display: index === current ? 'block' : 'none' }}>
            {step.content}
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          {current > 0 && <Button onClick={prev}>Anterior</Button>}
          {current < steps.length - 1 && <Button type="primary" onClick={next}>Siguiente</Button>}
          {current === steps.length - 1 && (
            <Button type="primary" htmlType="submit" loading={loading}>
              Enviar
            </Button>
          )}
        </div>
      </Form>
    </Card>
  );
};

export default ExampleForm;
