import React from 'react';
import { Form, Input, Slider, Select, Button } from 'antd';

const { Option } = Select;

const Example = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Datos guardados:', values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        nombre: '',
        calificacion: 50,
        escuela: 'Escolarizada',
      }}
    >
      <Form.Item
        label="Nombre"
        name="nombre"
        rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}
      >
        <Input placeholder="Ingresa tu nombre" />
      </Form.Item>

      <Form.Item
        label="Calificación"
        name="calificacion"
        rules={[{ required: true, message: 'Por favor selecciona la calificación' }]}
      >
        <Slider min={0} max={100} />
      </Form.Item>

      <Form.Item
        label="Escuela"
        name="escuela"
        rules={[{ required: true, message: 'Por favor selecciona un tipo de escuela' }]}
      >
        <Select placeholder="Selecciona tipo de escuela">
          <Option value="Escolarizada">Escolarizada</Option>
          <Option value="No escolarizada">No escolarizada</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Guardar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Example;
