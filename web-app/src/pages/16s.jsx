import React, { useState } from 'react';
import { Steps, Button, Form, Input, Card, Typography, DatePicker, Select, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import BACKEND_URL from '../../config/backend';
import Swal from 'sweetalert2';
const { Dragger } = Upload;
const { Step } = Steps;
const { Title } = Typography;
const { Option } = Select;

const XVI_S = ({user}) => {
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
const [modalProfundidadVisible, setProfundidadVisible] = useState(false);
  const [profundidad, setProfundidad] = useState(['Top', 'Deep', 'Col', 'B', 'A', 'C']);
  const [nuevoTipo, setNuevoTipo] = useState('');
  const [modalTipoVisible, setModalTipoVisible] = useState(false);
const [nuevoProfundidad, setNuevoProfundidad] = useState(''); // para profundidad
const [nuevoTipoMuestra, setNuevoTipoMuestra] = useState(''); // para tipo de muestra

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

  //--------------------------------------------------------   seccion de datos enlaces
  const [imagenesCepas, setImagenesCepas] = useState([]);
const [imagenesMuestreo, setImagenesMuestreo] = useState([]);
const [imagenesUFC, setImagenesUFC] = useState([]);
const [detalles, setDetalles] = useState([]);

  const handleSecuenciaChange = (e) => {
    const secuencia = e.target.value || '';
    form.setFieldsValue({
      longitud: secuencia.length,
    });
  };

  const steps = [
    //----------------------- Datos Generales
    {
      title: 'Datos Generales (16s)',
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
       <Form.Item
  name="linkAuxiliar"
  label="Enlace auxiliar (Google Drive, OneDrive, etc.)"
  rules={[{ required: false }]} // explícitamente no requerido
>
  <Input placeholder="Enlace auxiliar" />
</Form.Item>

        </>
      )
    },
    //----------------------- Características de la muestra
    {
      title: 'Información del sitio',
      content: (
        <>

         
         <Form.Item label="Sitio" required>
  <Input.Group compact>
    <Form.Item
      name="sitio"
      noStyle
      rules={[{ required: true, message: 'Por favor indica el sitio' }]}
      validateTrigger="onChange"
    >
      <Select
        showSearch
        allowClear
        placeholder="Selecciona o escribe para buscar"
        style={{ width: 'calc(100% - 40px)' }}
        filterOption={(input, option) =>
          option?.children?.toLowerCase().includes(input.toLowerCase())
        }
      >
        {sitios.map((sitio, index) => (
          <Option key={index} value={sitio}>{sitio}</Option>
        ))}
      </Select>
    </Form.Item>
    <Button icon={<PlusOutlined />} onClick={() => setModalSitioVisible(true)} />
  </Input.Group>
</Form.Item>


            <Form.Item
                      name="sitioEspecifico"
                      label="Sitio específico"
                      required
                      rules={[{ required: true, message: 'Por favor indica el sitio específico' }]}
                    >
                      <Input placeholder="Sitio específico" />
                    </Form.Item>

        <Form.Item label="Profundidad" required>
  <Input.Group compact>
    <Form.Item
      name="profundidad"
      noStyle
      rules={[{ required: true, message: 'Por favor indica la profundidad' }]}
      validateTrigger="onChange"
    >
      <Select
        showSearch
        allowClear
        placeholder="Selecciona o escribe para buscar"
        style={{ width: 'calc(100% - 40px)' }}
        filterOption={(input, option) =>
          option?.children?.toLowerCase().includes(input.toLowerCase())
        }
      >
        {profundidad.map((prof, index) => (
          <Option key={index} value={prof}>{prof}</Option>
        ))}
      </Select>
    </Form.Item>
    <Button icon={<PlusOutlined />} onClick={() => setModalProfundidadVisible(true)} />
  </Input.Group>
</Form.Item>


          
        <Form.Item label="Tipo de muestra" required>
  <Input.Group compact>
    <Form.Item
      name="tipoMuestra"
      noStyle
      rules={[{ required: true, message: 'Por favor indica el tipo de muestra' }]}
      validateTrigger="onChange"
    >
      <Select
        showSearch
        allowClear
        placeholder="Selecciona o escribe para buscar"
        style={{ width: 'calc(100% - 40px)' }}
        filterOption={(input, option) =>
          option?.children?.toLowerCase().includes(input.toLowerCase())
        }
      >
        {tiposMuestra.map((tipo, index) => (
          <Option key={index} value={tipo}>{tipo}</Option>
        ))}
      </Select>
    </Form.Item>
    <Button icon={<PlusOutlined />} onClick={() => setModalTipoMuestraVisible(true)} />
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
         <Form.Item label="Tratamiento" required>
  <Input.Group compact>
    <Form.Item
      name="tratamiento"
      noStyle
      rules={[{ required: true, message: 'Por favor indica el tratamiento' }]}
      validateTrigger="onChange"
    >
      <Select
        showSearch
        allowClear
        placeholder="Selecciona o escribe para buscar"
        style={{ width: 'calc(100% - 40px)' }}
        filterOption={(input, option) =>
          option?.children?.toLowerCase().includes(input.toLowerCase())
        }
      >
        {tratamiento.map((trat, index) => (
          <Option key={index} value={trat}>{trat}</Option>
        ))}
      </Select>
    </Form.Item>
    <Button icon={<PlusOutlined />} onClick={() => setModalTratamientoVisible(true)} />
  </Input.Group>
</Form.Item>


          <Form.Item name="fenotipo1" label="Fenotipo 1" rules={[{ required: true, message: 'Por favor indica el fenotipo 1' }]}>
            <Input placeholder="Fenotipo 1" />
          </Form.Item>
          <Form.Item name="fenotipo2" label="Fenotipo 2" rules={[{ required: true, message: 'Por favor indica el fenotipo 2' }]}>
            <Input placeholder="Fenotipo 2" />
          </Form.Item>
          <Form.Item name="fenotipo3" label="Fenotipo 3" rules={[{ required: true, message: 'Por favor indica el fenotipo 3' }]}>
            <Input placeholder="Fenotipo 3" />
          </Form.Item>
          <Form.Item name="secuencia" label="Secuencia" rules={[{ required: true, message: 'Por favor ingresa la secuencia' }]}>
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

          <Form.Item name="imagen_cepas" label="Links imagen cepas puras">
         <Dragger
  multiple
  fileList={imagenesCepas}
  beforeUpload={(file) => {
    setImagenesCepas((prev) => [...prev, file]);
    return false; // evita subida automática
  }}
  onRemove={(file) => {
    setImagenesCepas((prev) => prev.filter((f) => f.uid !== file.uid));
  }}
>
  <p className="ant-upload-drag-icon"><InboxOutlined /></p>
  <p className="ant-upload-text">Haz clic o arrastra archivos aquí</p>
</Dragger>


          </Form.Item>
          <Form.Item name="imagen_muestreo" label="Links imagen muestreo">
         <Dragger
  multiple
  fileList={imagenesMuestreo}
  beforeUpload={(file) => {
    setImagenesMuestreo((prev) => [...prev, file]);
    return false; // evita subida automática
  }}
  onRemove={(file) => {
    setImagenesMuestreo((prev) => prev.filter((f) => f.uid !== file.uid));
  }}
>
  <p className="ant-upload-drag-icon"><InboxOutlined /></p>
  <p className="ant-upload-text">Haz clic o arrastra archivos aquí</p>
</Dragger>

          </Form.Item>
          <Form.Item name="imagen_ufc" label="Links UFC">
         <Dragger
  multiple
  fileList={imagenesUFC}
  beforeUpload={(file) => {
    setImagenesUFC((prev) => [...prev, file]);
    return false; // evita subida automática
  }}
  onRemove={(file) => {
    setImagenesUFC((prev) => prev.filter((f) => f.uid !== file.uid));
  }}
>
  <p className="ant-upload-drag-icon"><InboxOutlined /></p>
  <p className="ant-upload-text">Haz clic o arrastra archivos aquí</p>
</Dragger>

          </Form.Item>
          <Form.Item name="imagen_detalles" label="Links detalles">
        <Dragger
  multiple
  fileList={detalles}
  beforeUpload={(file) => {
    setDetalles((prev) => [...prev, file]);
    return false; // evita subida automática
  }}
  onRemove={(file) => {
    setDetalles((prev) => prev.filter((f) => f.uid !== file.uid));
  }}
>
  <p className="ant-upload-drag-icon"><InboxOutlined /></p>
  <p className="ant-upload-text">Haz clic o arrastra archivos aquí</p>
</Dragger>

          </Form.Item>
        </>
      )
    }

  ];

  const next = async () => {
  try {
    // Validar todos los campos del step actual
    // Obtenemos los nombres de los campos del step actual
    const stepFields = steps[current].content.props.children
      .filter(child => child.props && child.props.name)
      .map(child => child.props.name);

    await form.validateFields(stepFields); // valida solo los campos de este step
    setCurrent(current + 1);
  } catch (errorInfo) {
    // Si hay errores de validación, no avanzar
    console.log('Campos faltantes o incorrectos:', errorInfo);
  }
};

  const prev = () => setCurrent(current - 1);

const onFinish = async (values) => {
  try {
    // 🔹 Construir el JSON base según tu formato
    const payload = {
      type_form: "16s",
      datos_generales: {
        id_responsable: user,
        date: values.mesAno ? values.mesAno.format("YYYY-MM") : "",
        nombre_cepa: values.nombreCepa || "",
        estrategia_muestreo: values.estrategiaMuestreo || "",
        link_auxiliar: values.linkAuxiliar || "none"
      },
      informacion_sitio: {
        sitio: values.sitio || "",
        sitio_especifico: values.sitioEspecifico || "",
        profundidad: values.profundidad || "",
        tipo_muestra: values.tipoMuestra || ""
      },
      datos_secuencia: {
        tratamiento: values.tratamiento || "",
        fenotipo_1: values.fenotipo1 || "",
        fenotipo_2: values.fenotipo2 || "",
        fenotipo_3: values.fenotipo3 || "",
        secuencia: values.secuencia || "",
        longitud_secuencia: values.longitud || 0
      },
      enlaces: {
        link_imagenes_cepas_puras: imagenesCepas.length > 0 ? `archivos/${user}/16s/cepas_puras` : "none",
        link_imagenes_muestreo: imagenesMuestreo.length > 0 ? `archivos/${user}/16s/imagenes_muestreo` : "none",
        links_ufc: imagenesUFC.length > 0 ? `archivos/${user}/16s/ufc` : "none",
        link_detalles: detalles.length > 0 ? `archivos/${user}/16s/detalles` : "none"
      }
    };

    console.log("JSON final a enviar:", payload);

    // 🔹 Enviar los archivos si existen
    if (imagenesCepas.length || imagenesMuestreo.length || imagenesUFC.length || detalles.length) {
      const formData = new FormData();
      imagenesCepas.forEach(file => formData.append("imagenes_cepas_puras", file));
      imagenesMuestreo.forEach(file => formData.append("imagenes_muestreo", file));
      imagenesUFC.forEach(file => formData.append("ufc", file));
      detalles.forEach(file => formData.append("carpeta_detalles", file));

      const resFiles = await fetch(`${BACKEND_URL}/16s/files/upload/${user}`, {
        method: "POST",
        body: formData
      });
      const dataFiles = await resFiles.json();
      console.log("Respuesta subida archivos:", dataFiles);
    }

    // 🔹 Enviar JSON al endpoint de información
    const resInfo = await fetch(`${BACKEND_URL}/16s/upload/information`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const dataInfo = await resInfo.json();
    if (dataInfo.status === "success") {
          Swal.fire({
            icon: "success",
            title: "¡Éxito!",
            text: `Análisis registrado con ID: ${dataInfo.analisis_id}`,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Aceptar",
          }).then(() => {
            //recargar la pagina
            window.location.reload();
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "El servidor no devolvió éxito",
          });
        }
     
    console.log("Respuesta subida información:", dataInfo);

  } catch (err) {
    console.error("Error al enviar:", err);
    Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message,
        });
  }
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
  {steps.map((step, index) => (
    <div
      key={index}
      style={{ display: index === current ? 'block' : 'none' }}
    >
      {step.content}
    </div>
  ))}

  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
    {current > 0 && <Button onClick={prev}>Anterior</Button>}
    {current < steps.length - 1 && <Button type="primary" onClick={next}>Siguiente</Button>}
    {current === steps.length - 1 && <Button type="primary" htmlType="submit">Enviar</Button>}
  </div>
</Form>

   {/* Modal para agregar nuevo sitio */}
<Modal
  title="Agregar nuevo sitio"
  centered
  visible={modalSitioVisible}
  onOk={() => {
    if (nuevoSitio) {
      setSitios([...sitios, nuevoSitio]);
      form.setFieldsValue({ sitio: nuevoSitio }); // ✅ seleccionado
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
      

<Modal
  title="Agregar nueva profundidad"
  centered
  visible={modalProfundidadVisible}
  onOk={() => {
    if (nuevoProfundidad) {
      setProfundidad([...profundidad, nuevoProfundidad]);
      form.setFieldsValue({ profundidad: nuevoProfundidad }); // ✅ seleccionado
      setNuevoProfundidad('');
      setProfundidadVisible(false);
    }
  }}
  onCancel={() => {
    setNuevoProfundidad('');
    setProfundidadVisible(false);
  }}
>
  <Input
    placeholder="Nombre de la nueva profundidad"
    value={nuevoProfundidad}
    onChange={e => setNuevoProfundidad(e.target.value)}
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
  );
};

export default XVI_S;
