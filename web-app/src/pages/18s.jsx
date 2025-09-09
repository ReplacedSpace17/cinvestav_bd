import React, { useState } from 'react';
import { Steps, Button, Form, Input, Card, Typography, DatePicker, Select, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
const { Dragger } = Upload;
const { Step } = Steps;
const { Title } = Typography;
const { Option } = Select;

const XVIII_S = ({user}) => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();

  // ------------------------------------------------------------------   seccion de datos generales
  const [responsables, setResponsables] = useState([]);
  const [selectedResponsable, setSelectedResponsable] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newResponsable, setNewResponsable] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: ''
  });

  // ------------------------------------------------------------------   seccion de caraceristicas de la muestra
  const [sitios, setSitios] = useState(['Churince', 'Pozas Rojas', 'Poza Azul']);
  const [sitiosEspecifico, setSitioEspecifico] = useState(['Poza 1 Felipe ', 'Poza Azul ', 'Poza 1 sitio B', 'Poza 1 sitio C', 'Poza 1', 'Poza 2', 'Poza 3', 'Poza 4', 'Poza 5']);
  const [nuevoSitio, setNuevoSitio] = useState('');
  const [nuevoSitioEspec, setNuevoSitioEspec] = useState('');
  const [modalSitioVisible, setModalSitioVisible] = useState(false);
  const [modalSitioEspecVisible, setModalSitioEspecVisible] = useState(false);

  const [profundidad, setProfundidad] = useState(['Top', 'Deep', 'Col', 'B', 'A', 'C']);
  const [nuevoTipo, setNuevoTipo] = useState('');
  const [modalTipoVisible, setModalTipoVisible] = useState(false);

  //--------------------------------------------------------   seccion de datos de la muestra
  const [tiposAnalisis, setTiposAnalisis] = useState(['Metagenoma', 'Genoma', 'Transcriptoma']);
  const [plataformasSecuenciacion, setPlataformasSecuenciacion] = useState(['Illumina', 'PacBio', 'Oxford Nanopore']);
  const [lugaresSecuenciacion, setLugaresSecuenciacion] = useState(['Langebio', 'Novogene', 'Solena', 'Otro']);

  const [modalTipoAnalisisVisible, setModalTipoAnalisisVisible] = useState(false);
  const [modalPlataformaVisible, setModalPlataformaVisible] = useState(false);
  const [modalLugarVisible, setModalLugarVisible] = useState(false);
  const [tiposMuestra, setTiposMuestra] = useState(['Agua', 'Suelo', 'Sedimento', 'Microbiota', 'Bacteria', 'Comunidad']);
  const [nuevoValor, setNuevoValor] = useState('');
  const [tratamiento, setTratamiento] = useState(['Heated', 'No Heated']);

  const handleSecuenciaChange = (e) => {
    const secuencia = e.target.value || '';
    form.setFieldsValue({
      longitud: secuencia.length,
    });
  };

  const steps = [
    //----------------------- Datos Generales
    {
      title: 'Datos Generales (18s)',
      content: (
        <>

          <Form.Item
            name="mesAno"
            label="Fecha"
            rules={[{ required: true, message: 'Por favor selecciona el mes y año' }]}
          >
            <DatePicker picker="month" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="nombreCepa" label="Nombre cepa" rules={[{ required: true, message: 'Por favor ingresa el nombre de cepa' }]}>
            <Input placeholder="Nombre cepa..." />
          </Form.Item>
          <Form.Item name="estrategiaMuestreo" label="Estrategia de muestreo" rules={[{ required: true, message: 'Por favor ingresa la estrategia de muestreo' }]}>
            <Input placeholder="Estrategia de muestreo" />
          </Form.Item>

        </>
      )
    },
    //----------------------- Características de la muestra
    {
      title: 'Información del sitio',
      content: (
        <>

          <Form.Item name="sitio" label="Sitio">
            <Input.Group compact>
              <Select
                showSearch
                allowClear
                placeholder="Selecciona o escribe para buscar"
                style={{ width: 'calc(100% - 40px)' }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {sitios.map((sitio, index) => (
                  <Option key={index} value={sitio}>{sitio}</Option>
                ))}
              </Select>
              <Button icon={<PlusOutlined />} onClick={() => setModalSitioVisible(true)} />
            </Input.Group>
          </Form.Item>

          <Form.Item name="sitioEspecifico" label="Sitio específico">
            <Input.Group compact>
              <Select
                showSearch
                allowClear
                placeholder="Selecciona o escribe para buscar"
                style={{ width: 'calc(100% - 40px)' }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {sitiosEspecifico.map((especifico, index) => (
                  <Option key={index} value={especifico}>{especifico}</Option>
                ))}
              </Select>
              <Button icon={<PlusOutlined />} onClick={() => setModalSitioEspecVisible(true)} />
            </Input.Group>
          </Form.Item>

          <Form.Item name="profundidad" label="Profundidad">
            <Input.Group compact>
              <Select
                showSearch
                allowClear
                placeholder="Selecciona o escribe para buscar"
                style={{ width: 'calc(100% - 40px)' }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {profundidad.map((tipo, index) => (
                  <Option key={index} value={tipo}>{tipo}</Option>
                ))}
              </Select>
              <Button icon={<PlusOutlined />} onClick={() => setModalTipoVisible(true)} />
            </Input.Group>
          </Form.Item>
          <Form.Item name="tipoMuestra" label="Tipo de muestra">
            <Input.Group compact>
              <Select
                showSearch
                allowClear
                placeholder="Selecciona o escribe para buscar"
                style={{ width: 'calc(100% - 40px)' }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {tiposMuestra.map((tipo, index) => (
                  <Option key={index} value={tipo}>{tipo}</Option>
                ))}
              </Select>
              <Button icon={<PlusOutlined />} onClick={() => setModalTipoVisible(true)} />
            </Input.Group>
          </Form.Item>


        </>
      )
    },

    //----------------------- Datos de la muestra
    //----------------------- Datos de la muestra
    {
      title: 'Datos de secuencia',
      content: (
        <>
          <Form.Item label="Tratamiento" name="tratamiento">
            <Input.Group compact>
              <Select
                style={{ width: 'calc(100% - 40px)' }}
                placeholder="Selecciona tipo de análisis"
              >
                {tratamiento.map((tipo, index) => (
                  <Option key={index} value={tipo}>{tipo}</Option>
                ))}
              </Select>
            </Input.Group>
          </Form.Item>

          <Form.Item name="fenotipo1" label="Fenotipo 1">
            <Input placeholder="Fenotipo 1" />
          </Form.Item>
          <Form.Item name="fenotipo2" label="Fenotipo 2">
            <Input placeholder="Fenotipo 2" />
          </Form.Item>
          <Form.Item name="fenotipo3" label="Fenotipo 3">
            <Input placeholder="Fenotipo 3" />
          </Form.Item>
          <Form.Item name="secuencia" label="Secuencia">
            <Input.TextArea
              placeholder="Secuencia"
              autoSize={{ minRows: 2, maxRows: 4 }}
              onChange={handleSecuenciaChange}
            />
          </Form.Item>

          {/* Longitud (campo de solo lectura) */}
          <Form.Item name="longitud" label="Longitud de la secuencia">
            <Input placeholder="Longitud" readOnly />
          </Form.Item>
        </>
      )
    },

    //----------------------- Datos administrativos
    {
      title: 'Enlaces',
      content: (
        <>
          {/* Software o pipeline utilizado */}

          <Form.Item name="imagen" label="Links imagen cepas puras">
            <Dragger
              name="file"
              multiple
              beforeUpload={() => false} // Evita la carga automática
              accept="*" // Opcional: restringir tipos de archivo
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Haz clic o arrastra uno o más archivos aquí</p>

            </Dragger>
          </Form.Item>
          <Form.Item name="imagen" label="Links imagen muestreo">
          <Dragger
              name="file"
              multiple
              beforeUpload={() => false} // Evita la carga automática
              accept="*" // Opcional: restringir tipos de archivo
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Haz clic o arrastra uno o más archivos aquí</p>

            </Dragger>
          </Form.Item>
          <Form.Item name="imagen" label="Links UFC">
          <Dragger
              name="file"
              multiple
              beforeUpload={() => false} // Evita la carga automática
              accept="*" // Opcional: restringir tipos de archivo
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Haz clic o arrastra uno o más archivos aquí</p>

            </Dragger>
          </Form.Item>
          <Form.Item name="imagen" label="Links detalles">
          <Dragger
              name="file"
              multiple
              beforeUpload={() => false} // Evita la carga automática
              accept="*" // Opcional: restringir tipos de archivo
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Haz clic o arrastra uno o más archivos aquí</p>

            </Dragger>
          </Form.Item>
        </>
      )
    }

  ];

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const onFinish = (values) => {
    console.log('Formulario enviado:', values);
    window.location.reload();
  };

  const handleModalOk = () => {
    if (newResponsable.nombre && newResponsable.apellidoPaterno && newResponsable.apellidoMaterno) {
      const nombreCompleto = `${newResponsable.nombre} ${newResponsable.apellidoPaterno} ${newResponsable.apellidoMaterno}`;
      setResponsables([...responsables, { ...newResponsable, nombreCompleto }]);
      setSelectedResponsable(nombreCompleto);
      setModalVisible(false);
      setNewResponsable({ nombre: '', apellidoPaterno: '', apellidoMaterno: '' });
    } else {
      alert('Por favor llena todos los campos');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setNewResponsable({ nombre: '', apellidoPaterno: '', apellidoMaterno: '' });
  };

  return (
    <Card
      title={<Title level={3} style={{ marginBottom: 0 }}>{steps[current].title}</Title>}
      style={{ maxWidth: 400, margin: '2rem auto' }}
    >
      <Steps
        current={current}
        style={{ marginBottom: 24 }}
        className="custom-steps"
      >
        {steps.map((_, index) => (
          <Step key={index} />
        ))}
      </Steps>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        {steps[current].content}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          {current > 0 && (
            <Button onClick={prev}>
              Anterior
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button type="primary" onClick={next}>
              Siguiente
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" htmlType="submit"
              onClick={() => {
                navigate('/');
              }
              }>
              Enviar
            </Button>
          )}
        </div>
      </Form>

      {/* Modal para agregar responsable */}
      <Modal
        title="Agregar Responsable"
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form layout="vertical">
          <Form.Item
            label="Nombre"
            rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}
          >
            <Input
              value={newResponsable.nombre}
              onChange={(e) => setNewResponsable({ ...newResponsable, nombre: e.target.value })}
            />
          </Form.Item>
          <Form.Item
            label="Apellido Paterno"
            rules={[{ required: true, message: 'Por favor ingresa el apellido paterno' }]}
          >
            <Input
              value={newResponsable.apellidoPaterno}
              onChange={(e) => setNewResponsable({ ...newResponsable, apellidoPaterno: e.target.value })}
            />
          </Form.Item>
          <Form.Item
            label="Apellido Materno"
            rules={[{ required: true, message: 'Por favor ingresa el apellido materno' }]}
          >
            <Input
              value={newResponsable.apellidoMaterno}
              onChange={(e) => setNewResponsable({ ...newResponsable, apellidoMaterno: e.target.value })}
            />
          </Form.Item>
        </Form>
      </Modal>
      {/* Modal para agregar nuevo sitio */}
      <Modal
        title="Agregar nuevo sitio"
        visible={modalSitioVisible}
        onOk={() => {
          if (nuevoSitio) {
            setSitios([...sitios, nuevoSitio]);
            form.setFieldsValue({ sitio: nuevoSitio });
            setNuevoSitio('');
            setModalSitioVisible(false);
          }
        }}
        onCancel={() => {
          setNuevoSitio('');
          setModalSitioVisible(false);
        }}
      >
        <Input
          placeholder="Nombre del nuevo sitio"
          value={nuevoSitioEspec}
          onChange={e => setNuevoSitio(e.target.value)}
        />
      </Modal>
      <Modal
        title="Agregar nuevo sitio especifico"
        visible={modalSitioEspecVisible}
        onOk={() => {
          if (nuevoSitioEspec) {
            setSitioEspecifico([...sitios, nuevoSitioEspec]);
            form.setFieldsValue({ sitio: nuevoSitioEspec });
            setNuevoSitioEspec('');
            setModalSitioEspecVisible(false);
          }
        }}
        onCancel={() => {
          setNuevoSitio('');
          setModalSitioEspecVisible(false);
        }}
      >
        <Input
          placeholder="Nombre del nuevo sitio especifico"
          value={nuevoSitioEspec}
          onChange={e => setNuevoSitioEspec(e.target.value)}
        />
      </Modal>
      {/* Modal para agregar nuevo tipo de muestra */}
      <Modal
        title="Agregar nuevo tipo de muestra"
        visible={modalTipoVisible}
        onOk={() => {
          if (nuevoTipo) {
            setProfundidad([...profundidad, nuevoTipo]);
            form.setFieldsValue({ tipoMuestra: nuevoTipo });
            setNuevoTipo('');
            setModalTipoVisible(false);
          }
        }}
        onCancel={() => {
          setNuevoTipo('');
          setModalTipoVisible(false);
        }}
      >
        <Input
          placeholder="Nombre del nuevo tipo de muestra"
          value={nuevoTipo}
          onChange={e => setNuevoTipo(e.target.value)}
        />
      </Modal>
      {/* Modal para agregar nuevo tipo de análisis */}
      <Modal
        title="Agregar nuevo tipo de análisis"
        visible={modalTipoAnalisisVisible}
        onOk={() => {
          if (nuevoValor) {
            setTiposAnalisis([...tiposAnalisis, nuevoValor]);
            form.setFieldsValue({ tipoAnalisis: nuevoValor });
            setNuevoValor('');
            setModalTipoAnalisisVisible(false);
          }
        }}
        onCancel={() => setModalTipoAnalisisVisible(false)}
      >
        <Input value={nuevoValor} onChange={e => setNuevoValor(e.target.value)} />
      </Modal>

      <Modal
        title="Agregar nueva plataforma"
        visible={modalPlataformaVisible}
        onOk={() => {
          if (nuevoValor) {
            setPlataformasSecuenciacion([...plataformasSecuenciacion, nuevoValor]);
            form.setFieldsValue({ plataformaSecuenciacion: nuevoValor });
            setNuevoValor('');
            setModalPlataformaVisible(false);
          }
        }}
        onCancel={() => setModalPlataformaVisible(false)}
      >
        <Input value={nuevoValor} onChange={e => setNuevoValor(e.target.value)} />
      </Modal>

      <Modal
        title="Agregar nuevo lugar de secuenciación"
        visible={modalLugarVisible}
        onOk={() => {
          if (nuevoValor) {
            setLugaresSecuenciacion([...lugaresSecuenciacion, nuevoValor]);
            form.setFieldsValue({ lugarSecuenciacion: nuevoValor });
            setNuevoValor('');
            setModalLugarVisible(false);
          }
        }}
        onCancel={() => setModalLugarVisible(false)}
      >
        <Input value={nuevoValor} onChange={e => setNuevoValor(e.target.value)} />
      </Modal>


      {/* Estilos en línea para ocultar los títulos de los pasos */}
      <style>{`
        .custom-steps .ant-steps-item-title {
          display: none;
        }
      `}</style>
    </Card>
  );
};

export default XVIII_S;
