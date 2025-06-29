import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Steps, Button, Form, Input, Card, Typography, DatePicker, Select, Modal, Layout, notification, Upload} from 'antd';
import { PlusOutlined, InboxOutlined } from '@ant-design/icons';


const { Dragger } = Upload;
const { Step } = Steps;
const { Title } = Typography;
const { Option } = Select;
const { Content } = Layout;
import JSZip from 'jszip';
import '././../styles/genomic.css'; // o el nombre de tu archivo CSS


const Genomica = () => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [modalExito, setModalExito] = useState(false);
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
  const [nuevoSitio, setNuevoSitio] = useState('');
  const [modalSitioVisible, setModalSitioVisible] = useState(false);

  const [tiposMuestra, setTiposMuestra] = useState(['Agua', 'Suelo', 'Sedimento', 'Microbiota', 'Bacteria', 'Comunidad', 'Core', 'Microbialita', 'mat']);
  const [nuevoTipo, setNuevoTipo] = useState('');
  const [modalTipoVisible, setModalTipoVisible] = useState(false);

  //--------------------------------------------------------   seccion de datos de la muestra
  const [tiposAnalisis, setTiposAnalisis] = useState(['Metagenoma', 'Genoma', 'Transcriptoma']);
  const [plataformasSecuenciacion, setPlataformasSecuenciacion] = useState(['Illumina', 'PacBio', 'Oxford Nanopore']);
  const [lugaresSecuenciacion, setLugaresSecuenciacion] = useState(['Langebio', 'Novogene', 'Solena', 'Otro']);

  const [modalTipoAnalisisVisible, setModalTipoAnalisisVisible] = useState(false);
  const [modalPlataformaVisible, setModalPlataformaVisible] = useState(false);
  const [modalLugarVisible, setModalLugarVisible] = useState(false);

  const [nuevoValor, setNuevoValor] = useState('');

  const navigate = useNavigate();
  useEffect(() => {
    notification.config({
      getContainer: () => document.getElementById('root') || document.body,
    });
    
  }, []);

  
  const handleBeforeUpload = async (fileList) => {
    const zip = new JSZip();

    for (const file of fileList) {
      // file.webkitRelativePath contiene la estructura de carpetas
      const pathInZip = file.webkitRelativePath || file.name;
      zip.file(pathInZip, file);
    }

    try {
      const content = await zip.generateAsync({ type: 'blob' });

      // Opcional: enviar al backend como FormData
      const formData = new FormData();
      formData.append('archivoZip', content, 'carpeta.zip');

      // Aquí puedes hacer tu POST a tu backend
      // await fetch('/upload', { method: 'POST', body: formData });

      message.success('Carpeta comprimida correctamente');
    } catch (err) {
      console.error('Error al comprimir:', err);
      message.error('Error al comprimir la carpeta');
    }

    // Previene la carga automática de archivos individuales
    return false;
  };

  
  const steps = [
    //----------------------- Datos Generales
    {
      title: 'Datos Generales',
      content: (
        <>
          <Form.Item
      name="carpetaMuestreo"
      label="Carpeta detalle de muestreo "
      valuePropName="fileList"
      getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
    >
      <Dragger
        name="file"
        multiple
        directory // <-- esto permite seleccionar carpetas completas
        beforeUpload={(file, fileList) => {
          // solo ejecutamos con la lista completa
          handleBeforeUpload(fileList);
          return false; // bloquea subida automática
        }}
        accept="*"
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Haz clic o arrastra una carpeta completa aquí
        </p>
        
      </Dragger>
    </Form.Item>
          <Form.Item
            name="mesAno"
            label="Mes y Año"
            rules={[{ required: true, message: 'Por favor selecciona el mes y año' }]}
          >
            <DatePicker picker="month" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="responsable"
            label="Responsable del análisis"
            rules={[{ required: true, message: 'Por favor selecciona un responsable' }]}
          >
            <Select
              showSearch
              placeholder="Selecciona responsable"
              value={selectedResponsable}
              onChange={value => setSelectedResponsable(value)}
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            >
              {responsables.map((resp, index) => (
                <Option key={index} value={resp.nombreCompleto}>
                  {resp.nombreCompleto}
                </Option>
              ))}
            </Select>
            <Button
              icon={<PlusOutlined />}
              onClick={() => setModalVisible(true)}
              style={{ marginTop: '10px', width: '100%' }}
            >
              Agregar Responsable
            </Button>
          </Form.Item>
        </>
      )
    },
    //----------------------- Características de la muestra
    {
      title: 'Características de la muestra',
      content: (
        <>
          <Form.Item
            name="idMuestra"
            label="ID de la muestra"
            rules={[{ required: true, message: 'Por favor indica el ID' }]}
          >
            <Input placeholder="ID de la muestra." />
          </Form.Item>

          <Form.Item name="genero" label="Género">
            <Input placeholder="Género (opcional)" />
          </Form.Item>

          <Form.Item name="numeroCeparioGOB" label="Número de Cepario GOB">
            <Input placeholder="Número Cepario GOB (opcional)" />
          </Form.Item>

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

          <Form.Item
            name="sitioEspecifico"
            label="Sitio específico"
            rules={[{ required: true, message: 'Por favor indica el sitio específico' }]}
          >
            <Input placeholder="Sitio específico" />
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

          <Form.Item name="caracteristicas" label="Características específicas de la muestra">
            <Input.TextArea placeholder="Describir características específicas" rows={4} />
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
          <Form.Item label="Tipo de análisis" name="tipoAnalisis">
            <Input.Group compact>
              <Select
                style={{ width: 'calc(100% - 40px)' }}
                placeholder="Selecciona tipo de análisis"
              >
                {tiposAnalisis.map((tipo, index) => (
                  <Option key={index} value={tipo}>{tipo}</Option>
                ))}
              </Select>
              <Button icon={<PlusOutlined />} onClick={() => setModalTipoAnalisisVisible(true)} />
            </Input.Group>
          </Form.Item>

          <Form.Item name="metodoExtraccion" label="Método de extracción">
            <Input placeholder="Describe el método de extracción" />
          </Form.Item>

          <Form.Item label="Plataforma de secuenciación" name="plataformaSecuenciacion">
            <Input.Group compact>
              <Select
                style={{ width: 'calc(100% - 40px)' }}
                placeholder="Selecciona plataforma"
              >
                {plataformasSecuenciacion.map((plataforma, index) => (
                  <Option key={index} value={plataforma}>{plataforma}</Option>
                ))}
              </Select>
              <Button icon={<PlusOutlined />} onClick={() => setModalPlataformaVisible(true)} />
            </Input.Group>
          </Form.Item>

          <Form.Item label="Lugar de secuenciación" name="lugarSecuenciacion">
            <Input.Group compact>
              <Select
                style={{ width: 'calc(100% - 40px)' }}
                placeholder="Selecciona lugar"
              >
                {lugaresSecuenciacion.map((lugar, index) => (
                  <Option key={index} value={lugar}>{lugar}</Option>
                ))}
              </Select>
              <Button icon={<PlusOutlined />} onClick={() => setModalLugarVisible(true)} />
            </Input.Group>
          </Form.Item>

          <Form.Item
            name="datosCrudos"
            label="Datos crudos (archivos)"
            valuePropName="fileList"
            getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}
          >
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

          <Form.Item
            name="secuenciasEnsambladas"
            label="Secuencias ensambladas"
            valuePropName="fileList"
            getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}
          >
            <Dragger
              name="file"
              multiple
              beforeUpload={() => false} // evita carga automática
              accept="*" // opcional: tipos de archivo aceptados
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Haz clic o arrastra uno o más archivos aquí</p>

            </Dragger>
          </Form.Item>

          <Form.Item name="softwarePipeline" label="Software o pipeline utilizado">
            <Input placeholder="Ej. SPAdes, MetaPhlAn, etc." />
          </Form.Item>

          <Form.Item name="bioproject" label="BioProject">
            <Input />
          </Form.Item>

          <Form.Item name="biosample" label="BioSample">
            <Input />
          </Form.Item>

          <Form.Item name="sra" label="SRA">
            <Input />
          </Form.Item>

          <Form.Item name="ncbiAssembly" label="NCBI Assembly">
            <Input />
          </Form.Item>
        </>
      )
    },

    //----------------------- Datos administrativos
    {
      title: 'Datos administrativos',
      content: (
        <>
          {/* Software o pipeline utilizado */}
          <Form.Item
            name="software"
            label="Software o pipeline utilizado"
            rules={[{ required: true, message: 'Especifica el software' }]}
          >
            <Input placeholder="Software o pipeline" />
          </Form.Item>

          {/* Tags con links a publicaciones asociadas */}
          <Form.Item
            name="tagsPublicaciones"
            label="Publicaciones asociadas"
          >
            <Input.TextArea
              placeholder="Ej. [PubMed:123456], [DOI:10.1234/xyz]"
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </Form.Item>

          {/* Notas o comentarios */}
          <Form.Item
            name="notasComentarios"
            label="Notas o comentarios"
          >
            <Input.TextArea
              placeholder="Notas adicionales sobre el software o uso en el análisis"
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </Form.Item>
        </>
      )
    }

  ];

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const onFinish = (values) => {
    console.log('Formulario enviado:', values);
    //recargar la página
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

  //simular envío de formulario con un modal de envio
  const simulateSend = () => {
    Modal.success({
      title: 'Formulario enviado',
      content: 'Los datos han sido enviados correctamente.',
      onOk: () => {
        //
      }
    });
  }
  return (
    <Layout>
      <Content className='genomica-content'>
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

        <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={({ errorFields }) => {
    form.scrollToField(errorFields[0].name);
  }}>
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
              <Button type="primary" onClick={() => form.submit()}>
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
            value={nuevoSitio}
            onChange={e => setNuevoSitio(e.target.value)}
          />
        </Modal>

        {/* Modal para agregar nuevo tipo de muestra */}
        <Modal
          title="Agregar nuevo tipo de muestra"
          visible={modalTipoVisible}
          onOk={() => {
            if (nuevoTipo) {
              setTiposMuestra([...tiposMuestra, nuevoTipo]);
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
    </Content>
</Layout >
  );
};

export default Genomica;
