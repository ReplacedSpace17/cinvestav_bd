import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Steps, Button, Form, Input, Checkbox, message, Card, Typography, DatePicker, Select, Modal, Layout, notification, Upload} from 'antd';
import { PlusOutlined, InboxOutlined } from '@ant-design/icons';
import BACKEND_URL from '../../config/backend';
import Swal from "sweetalert2";

const { Dragger } = Upload;
const { Step } = Steps;
const { Title } = Typography;
const { Option } = Select;
const { Content } = Layout;
import JSZip from 'jszip';
import '././../styles/genomic.css'; // o el nombre de tu archivo CSS


const Genomica = ({user}) => {
  console.log("Usuario en Genomica:", user);
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [modalExito, setModalExito] = useState(false);

  const [carpetaDetalle, setCarpetaDetalle] = useState([]);
  const [datosCrudos, setDatosCrudos] = useState([]);

  // ------------------------------------------------------------------   seccion de datos generales
  const [selectedResponsable, setSelectedResponsable] = useState(user);
  const [nuevoTipoAnalisis, setNuevoTipoAnalisis] = useState('');
const [nuevaPlataforma, setNuevaPlataforma] = useState('');
const [nuevoLugar, setNuevoLugar] = useState('');


  // ------------------------------------------------------------------   seccion de caraceristicas de la muestra
  const [sitios, setSitios] = useState(['Churince', 'Pozas Rojas', 'Poza Azul']);
  const [nuevoSitio, setNuevoSitio] = useState('');
  const [modalSitioVisible, setModalSitioVisible] = useState(false);

  const [tiposMuestra, setTiposMuestra] = useState(['Agua', 'Suelo', 'Sedimento', 'Microbiota', 'Bacteria', 'Comunidad', 'Core', 'Microbialita']);
  const [nuevoTipo, setNuevoTipo] = useState('');
  const [modalTipoVisible, setModalTipoVisible] = useState(false);

  //--------------------------------------------------------   seccion de datos de la muestra
  const [tiposAnalisis, setTiposAnalisis] = useState(['Metagenoma', 'Genoma', 'Transcriptoma']);
  const [plataformasSecuenciacion, setPlataformasSecuenciacion] = useState(['Illumina', 'PacBio', 'Oxford Nanopore']);
  const [lugaresSecuenciacion, setLugaresSecuenciacion] = useState(['Langebio', 'Novogene', 'Solena']);

  const [modalTipoAnalisisVisible, setModalTipoAnalisisVisible] = useState(false);
  const [modalPlataformaVisible, setModalPlataformaVisible] = useState(false);
  const [modalLugarVisible, setModalLugarVisible] = useState(false);

  const [nuevoValor, setNuevoValor] = useState('');
  const [fileList, setFileList] = useState([]);
  const [imagesData, setImagesData] = useState([]); // { name, base64, description }
  const [showImages, setShowImages] = useState(false);
  const [modalVisibleImages, setModalVisibleModal] = useState(false);
  const [currentEditing, setCurrentEditing] = useState(null); 
  const [currentDescription, setCurrentDescription] = useState("");

   
    
    const [files_dataCrudos, setFile_datos_crudos] = useState([]);
    const [encabezados, setEncabezados] = useState([]);
    const [archivoActual, setArchivoActual] = useState(null);
    const [visibleModal, setVisibleModal] = useState(false);
    const [seleccionados, setSeleccionados] = useState([]);
const [finalJSON, setFinalJSON] = useState({
  url_datos_crudos: [],
  url_secuencias_ensambladas: []
});

    const [archivoIndex, setArchivoIndex] = useState(0);


    const [files_Sec_ensambladas, setSecuenciasEnsambladas] = useState([]);
const [encabezados_se, setEncabezadosSE] = useState([]);
const [archivoActual_se, setArchivoActual_SE] = useState(null);
const [visibleModal_SE, setVisibleModal_SE] = useState(false);

const procesarArchivo_se = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const sequences = text
      .split(">")
      .filter((block) => block.trim() !== "")
      .map((block) => {
        const [header, ...seqLines] = block.split("\n");
        return {
          extension: file.name.split(".").pop().toLowerCase(),
          encabezado: ">" + header.trim(),
          secuencia: seqLines.join("").trim(),
        };
      });
    setEncabezadosSE(sequences);
    setArchivoActual_SE(file.name);
    setVisibleModal_SE(true);
  };
  reader.readAsText(file);
};
const beforeUpload_secuencias_SE = (file) => {
  const isFasta =
    file.name.toLowerCase().endsWith(".fasta") ||
    file.name.toLowerCase().endsWith(".fastq");
  if (!isFasta) {
    message.error("Solo se permiten archivos .fasta o .fastq");
    return Upload.LIST_IGNORE;
  }

  const alreadyExists = files_Sec_ensambladas.some(
    (f) => f.name === file.name && f.size === file.size
  );
  if (alreadyExists) {
    message.warning(`El archivo "${file.name}" ya fue agregado`);
    return Upload.LIST_IGNORE;
  }

  setSecuenciasEnsambladas((prev) => [...prev, file]);

  // 🚀 Procesar inmediatamente el archivo y mostrar el modal
  procesarArchivo_se(file);

  return false; // evita el auto-upload de antd
};
const handleOk_SE = () => {
  const seleccionadosFinal = encabezados_se.filter((item) =>
    seleccionados.includes(item.encabezado)
  );

  setFinalJSON((prev) => {
    const actualizado = {
      ...prev, // 👈 importante para no borrar los otros campos
      url_secuencias_ensambladas: [
        ...prev.url_secuencias_ensambladas,
        ...seleccionadosFinal
      ],
    };
    console.log("📦 JSON actualizado (SE):", JSON.stringify(actualizado, null, 2));
    return actualizado;
  });

  setVisibleModal_SE(false);
  setSeleccionados([]);

  // Procesar siguiente archivo si hay
  const nextIndex = archivoIndex + 1; // ⚠️ aquí estabas mezclando index con file name
  if (nextIndex < files_Sec_ensambladas.length) {
    setArchivoActual_SE(nextIndex);
    procesarArchivo_se(files_Sec_ensambladas[nextIndex]);
  }
};


  const navigate = useNavigate();
  useEffect(() => {
    notification.config({
      getContainer: () => document.getElementById('root') || document.body,
    });
    
  }, []);
const procesarArchivo = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const sequences = text
        .split(">")
        .filter((block) => block.trim() !== "")
        .map((block) => {
          const [header, ...seqLines] = block.split("\n");
          return {
            extension: file.name.split(".").pop().toLowerCase(),
            encabezado: ">" + header.trim(),
            secuencia: seqLines.join("").trim(),
          };
        });
      setEncabezados(sequences);
      setArchivoActual(file.name);
      setVisibleModal(true);
    };
    reader.readAsText(file);
  };

const beforeUpload_secuencias = (file) => {
  const isFasta =
    file.name.toLowerCase().endsWith(".fasta") ||
    file.name.toLowerCase().endsWith(".fastq");
  if (!isFasta) {
    message.error("Solo se permiten archivos .fasta o .fastq");
    return Upload.LIST_IGNORE;
  }

  const alreadyExists = files_dataCrudos.some(
    (f) => f.name === file.name && f.size === file.size
  );
  if (alreadyExists) {
    message.warning(`El archivo "${file.name}" ya fue agregado`);
    return Upload.LIST_IGNORE;
  }

  setFile_datos_crudos((prev) => [...prev, file]);

  // 🚀 Procesar inmediatamente el archivo y mostrar el modal
  procesarArchivo(file);

  return false; // evita el auto-upload de antd
};

// Datos crudos
const handleOk = () => {
  const seleccionadosFinal = encabezados.filter((item) =>
    seleccionados.includes(item.encabezado)
  );

  setFinalJSON((prev) => {
    const actualizado = {
      ...prev, // 👈 mantener lo anterior
      url_datos_crudos: [
        ...prev.url_datos_crudos,
        ...seleccionadosFinal
      ],
    };
    console.log("📦 JSON actualizado (DC):", JSON.stringify(actualizado, null, 2));
    return actualizado;
  });

  setVisibleModal(false);
  setSeleccionados([]);

  const nextIndex = archivoIndex + 1;
  if (nextIndex < files_dataCrudos.length) {
    setArchivoIndex(nextIndex);
    procesarArchivo(files_dataCrudos[nextIndex]);
  }
};


  const handleSelectAll = () => {
    setSeleccionados(encabezados.map((e) => e.encabezado));
  };
  
    // Evita duplicados y solo imágenes
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Solo se permiten imágenes (JPG, PNG, etc.)");
      return Upload.LIST_IGNORE;
    }

    const alreadyExists = fileList.some(
      (f) => f.name === file.name && f.size === file.size
    );
    if (alreadyExists) {
      message.warning(`El archivo "${file.name}" ya fue agregado`);
      return Upload.LIST_IGNORE;
    }

    setFileList((prev) => [...prev, file]);
    return false;
  };

  // Convierte a Base64 y abre modal de descripción para todas
  // Convierte a Base64 y abre modal de descripción para todas
const handleConvertToString = () => {
  if (fileList.length === 0) {
    message.error("Debes subir al menos una imagen");
    return;
  }

  const allData = [];
  fileList.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      allData.push({ name: file.name, base64: e.target.result, description: "" });
      if (allData.length === fileList.length) {
        setImagesData(allData);
        message.success("✅ Todas las imágenes convertidas a Base64");

        // usar directamente allData en lugar de imagesData
        setCurrentEditing(0);
        setCurrentDescription(allData[0].description || "");
        setModalVisibleModal(true);
      }
    };
    reader.readAsDataURL(file);
  });
};


  // Mostrar imágenes
  const handleShowImages = () => {
    if (imagesData.length === 0) {
      message.warning("Primero convierte las imágenes");
      return;
    }
    setShowImages(true);
  };

  // Editar descripción
  const handleAddDescription = (index) => {
    setCurrentEditing(index);
    setCurrentDescription(imagesData[index].description || "");
    setModalVisibleModal(true);
  };

const handleModalOk = () => {
  const newImagesData = [...imagesData];
  newImagesData[currentEditing].description = currentDescription;
  setImagesData(newImagesData);

  if (currentEditing < imagesData.length - 1) {
    handleAddDescription(currentEditing + 1);
  } else {
    setModalVisibleModal(false);
    message.success("✅ Todas las descripciones agregadas");
    console.log("JSON final:", newImagesData);

    // 🚀 Avanzar automáticamente cuando termines
    setCurrent((prev) => prev + 1);
  }

  setCurrentDescription("");
};

  
  const steps = [
    //----------------------- Datos Generales
    {
      title: 'Datos Generales',
      content: (
        <>
      

<Form.Item label="Subir imágenes" required>
          <Dragger
            multiple
            fileList={fileList}
            beforeUpload={beforeUpload}
            onRemove={(file) =>
              setFileList((prev) => prev.filter((f) => f.uid !== file.uid))
            }
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Arrastra imágenes aquí o haz clic para seleccionar
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
            name="linkAuxiliar"
            label="Enlace auxiliar (Google Drive, OneDrive, etc.)"
            rules={[{ required: false, message: 'Por favor indica el enlace' }]}
          >
            <Input placeholder="Enlace auxiliar" />
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

<Form.Item label="Sitio" >
  <Input.Group compact>
    <Form.Item name="sitio" rules={[{ required: true, message: 'Por favor indica el sitio' }]} noStyle required>
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

         {/* =================== Tipo de muestra =================== */}
<Form.Item label="Tipo de muestra" required>
  <Input.Group compact>
    <Form.Item name="tipoMuestra" noStyle rules={[{ required: true, message: 'Por favor indica el tipo de muestra' }]}>
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
    <Button icon={<PlusOutlined />} onClick={() => setModalTipoVisible(true)} />
  </Input.Group>
</Form.Item>


          <Form.Item name="caracteristicas" label="Características específicas de la muestra" rules={[{ required: true, message: 'Por favor indica las características' }]}>
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
         {/* =================== Tipo de análisis =================== */}
<Form.Item label="Tipo de análisis" required>
  <div style={{ display: "flex", gap: "8px" }}>
    <Form.Item name="tipoAnalisis" style={{ flex: 1, marginBottom: 0 }} rules={[{ required: true, message: 'Por favor indica el tipo de análisis' }]}>
      <Select placeholder="Selecciona tipo de análisis">
        {tiposAnalisis.map((tipo, index) => (
          <Option key={index} value={tipo}>{tipo}</Option>
        ))}
      </Select>
    </Form.Item>
    <Button icon={<PlusOutlined />} onClick={() => setModalTipoAnalisisVisible(true)} />
  </div>
</Form.Item>




          <Form.Item name="metodoExtraccion" label="Método de extracción" rules={[{ required: true, message: 'Por favor indica el método de extracción' }]}>
            <Input placeholder="Describe el método de extracción" />
          </Form.Item>

         {/* =================== Plataforma de secuenciación =================== */}
<Form.Item label="Plataforma de secuenciación">
  <Input.Group compact>
    <Form.Item name="plataformaSecuenciacion" noStyle rules={[{ required: true, message: 'Por favor indica la plataforma de secuenciación' }]} required>
      <Select
        placeholder="Selecciona plataforma"
        style={{ width: 'calc(100% - 40px)' }}
      >
        {plataformasSecuenciacion.map((plataforma, index) => (
          <Option key={index} value={plataforma}>{plataforma}</Option>
        ))}
      </Select>
    </Form.Item>
    <Button icon={<PlusOutlined />} onClick={() => setModalPlataformaVisible(true)} />
  </Input.Group>
</Form.Item>


          {/* =================== Lugar de secuenciación =================== */}
<Form.Item label="Lugar de secuenciación">
  <Input.Group compact>
    <Form.Item name="lugarSecuenciacion" noStyle rules={[{ required: true, message: 'Por favor indica el lugar de secuenciación' }]} required>
      <Select
        placeholder="Selecciona lugar"
        style={{ width: 'calc(100% - 40px)' }}
      >
        {lugaresSecuenciacion.map((lugar, index) => (
          <Option key={index} value={lugar}>{lugar}</Option>
        ))}
      </Select>
    </Form.Item>
    <Button icon={<PlusOutlined />} onClick={() => setModalLugarVisible(true)} />
  </Input.Group>
</Form.Item>


        <Form.Item label="Datos crudos" required>
                    <Dragger
                      multiple
                      fileList={files_dataCrudos}
                      beforeUpload={beforeUpload_secuencias}
                      onRemove={(file) => {
                        setFile_datos_crudos((prev) =>
                          prev.filter((f) => f.uid !== file.uid)
                        );
                      }}
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Arrastra archivos aquí o haz clic para seleccionar
                      </p>
                    </Dragger>
                  </Form.Item>

 <Form.Item label="Secuencias ensambladas" required>
    <Dragger
      multiple
      fileList={files_Sec_ensambladas}
      beforeUpload={beforeUpload_secuencias_SE}
      onRemove={(file) => {
        setSecuenciasEnsambladas((prev) =>
          prev.filter((f) => f.uid !== file.uid)
        );
      }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Arrastra archivos aquí o haz clic para seleccionar
      </p>
    </Dragger>
  </Form.Item>

          <Form.Item name="softwarePipeline" label="Software o pipeline utilizado" rules={[{ required: true, message: 'Por favor indica el software o pipeline' }]}>
            <Input placeholder="Ej. SPAdes, MetaPhlAn, etc." />
          </Form.Item>

          <Form.Item name="bioproject" label="BioProject" rules={[{ required: true, message: 'Por favor indica el BioProject' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="biosample" label="BioSample" rules={[{ required: true, message: 'Por favor indica el BioSample' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="sra" label="SRA" rules={[{ required: true, message: 'Por favor indica el SRA' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="ncbiAssembly" label="NCBI Assembly" rules={[{ required: true, message: 'Por favor indica el NCBI Assembly' }]}>
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

  const stepFields = [
  // Step 0: Datos Generales
  ["mesAno", "linkAuxiliar"],
  
  // Step 1: Características de la muestra
  ["idMuestra", "sitio", "sitioEspecifico", "tipoMuestra", "caracteristicas"],
  
  // Step 2: Datos de secuencia
  ["tipoAnalisis", "plataformaSecuenciacion", "lugarSecuenciacion"],
  
  // Step 3: Datos administrativos
  ["software"] 
];

const next = async () => {
  try {
    await form.validateFields(stepFields[current]); 

    if (current === 0 && fileList.length > 0 && imagesData.length === 0) {
      // 🚀 Lanzar modal de descripciones antes de avanzar
      const allData = [];
      fileList.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          allData.push({
            name: file.name,
            base64: e.target.result,
            description: "",
          });
          if (allData.length === fileList.length) {
            setImagesData(allData);
            setCurrentEditing(0);
            setCurrentDescription(allData[0].description || "");
            setModalVisibleModal(true); // 👈 abre el modal de descripciones
          }
        };
        reader.readAsDataURL(file);
      });
      return; // 🔒 no pases todavía al siguiente paso
    }

    // Si no es paso 0 o ya se describieron imágenes, avanza
    setCurrent(current + 1);
  } catch (error) {
    console.log("Errores de validación:", error);
  }
};



  const prev = () => setCurrent(current - 1);

  

const onFinish = async (values) => {
  try {
    // ---------------- Subida de archivos (opcional) ----------------
    const formData = new FormData();
    if (carpetaDetalle.length > 0) {
      carpetaDetalle.forEach(file => {
        formData.append("carpeta_muestreo", file.originFileObj || file);
      });
    }
    if (datosCrudos.length > 0) {
      datosCrudos.forEach(file => {
        formData.append("datos_crudos", file.originFileObj || file);
      });
    }
    if (files_Sec_ensambladas.length > 0) {
  files_Sec_ensambladas.forEach(file => {
    formData.append("secuencias_ensambladas", file.originFileObj || file);
  });
}

    // 🔹 Primero subir archivos si hay
    let data = {};
    if (
      carpetaDetalle.length > 0 ||
      datosCrudos.length > 0 ||
      files_Sec_ensambladas.length > 0
    ) {
      /*
      const res = await fetch(`${BACKEND_URL}/genomica/files/upload/${user}`, {
        method: "POST",
        body: formData,
      });
      data = await res.json();
      */
    }


    // ---------------- Construcción del JSON final ----------------
    const resultadoFinal = {
      type_form: "genomica",
      datos_generales: {
        url_carpeta_muestreo: data.urls?.detalle_muestreo || "none",
        id_responsable: values.responsable || selectedResponsable,
        date: values.mesAno?.format("YYYY-MM") || "none",
        link_auxiliar: values.linkAuxiliar || "none",
        imgs: imagesData.map(img => ({
          name: img.name,
          base64: img.base64,
          description: img.description || "none"
        }))
      },
      muestra: {
        codigo_muestra: values.idMuestra || "none",
        genero: values.genero || "none",
        numero_cepario_GOB: values.numeroCeparioGOB || "none",
        sitio: values.sitio || "none",
        sitio_especifico: values.sitioEspecifico || "none",
        tipo_muestra: values.tipoMuestra || "none",
        carcateristicas_muestra: values.caracteristicas || "none"
      },
      datos_secuencia: {
        tipo_analisis: values.tipoAnalisis || "none",
        metodo_extraccion: values.metodoExtraccion || "none",
        plataforma_secuenciacion: values.plataformaSecuenciacion || "none",
        lugar_secuenciacion: values.lugarSecuenciacion || "none",
        url_datos_crudos: finalJSON.url_datos_crudos.length > 0 ? finalJSON.url_datos_crudos : "none",
        url_secuencias_ensambladas: finalJSON.url_secuencias_ensambladas.length > 0 ? finalJSON.url_secuencias_ensambladas : "none",
        software_utilizado: values.softwarePipeline || "none",
        bioproject: values.bioproject || "none",
        biosample: values.biosample || "none",
        sra: values.sra || "none",
        ncbi_assembly: values.ncbiAssembly || "none"
      },
      datos_administrativos: {
        software_utilizado: values.software || "none",
        publicaciones_relacionadas: values.tagsPublicaciones || "none",
        notas_comentarios: values.notasComentarios || "none"
      }
    };

    console.log("Json:");
    console.log(JSON.stringify(resultadoFinal, null, 2));

    // Aquí ya podrías enviarlo a tu backend:
    
    const resInfo = await fetch(`${BACKEND_URL}/genomica/upload/information`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resultadoFinal),
    });
    const dataInfo = await resInfo.json();
    console.log("Respuesta del backend:", dataInfo);
    //si succes un swal de exito
    if (dataInfo.status === "success") {
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "La información se ha enviado correctamente, analisis #" + dataInfo.analisis_id + ".",
      }).then(() => {
       // navigate("/dashboard");
      });
    }
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.message,
    });
  }
};









  


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

        <Form 
  form={form} 
  layout="vertical" 
  onFinish={onFinish}
  onFinishFailed={({ errorFields }) => form.scrollToField(errorFields[0].name)}
>
  {steps.map((step, index) => (
    <div
      key={index}
      style={{ display: index === current ? "block" : "none" }}
    >
      {step.content}
    </div>
  ))}

  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
    {current > 0 && (
      <Button onClick={prev}>Anterior</Button>
    )}
    {current < steps.length - 1 && (
  <Button type="primary" onClick={next}>Siguiente</Button>
)}

    {current === steps.length - 1 && (
      <Button type="primary" onClick={() => form.submit()}>Enviar</Button>
    )}
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

        {/* Modal para agregar nuevo tipo de muestra */}
        <Modal
  title="Agregar nuevo tipo de muestra"
  visible={modalTipoVisible}
  centered
  onOk={() => {
    if (nuevoTipo) {
      setTiposMuestra([...tiposMuestra, nuevoTipo]);
      form.setFieldsValue({ tipoMuestra: nuevoTipo }); // ✅ seleccionado
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
  centered
  onOk={() => {
    if (nuevoTipoAnalisis) {
      setTiposAnalisis([...tiposAnalisis, nuevoTipoAnalisis]);
      form.setFieldsValue({ tipoAnalisis: nuevoTipoAnalisis }); // ✅ seleccionado
      setNuevoTipoAnalisis('');
      setModalTipoAnalisisVisible(false);
    }
  }}
  onCancel={() => {
    setNuevoTipoAnalisis('');
    setModalTipoAnalisisVisible(false);
  }}
>
  <Input value={nuevoTipoAnalisis} onChange={e => setNuevoTipoAnalisis(e.target.value)} />
</Modal>


 <Modal
  title="Agregar nueva plataforma"
  visible={modalPlataformaVisible}
  onOk={() => {
    if (nuevaPlataforma) {
      setPlataformasSecuenciacion([...plataformasSecuenciacion, nuevaPlataforma]);
      form.setFieldsValue({ plataformaSecuenciacion: nuevaPlataforma });
      setNuevaPlataforma('');
      setModalPlataformaVisible(false);
    }
  }}
  onCancel={() => {
    setNuevaPlataforma('');
    setModalPlataformaVisible(false);
  }}
>
  <Input value={nuevaPlataforma} onChange={e => setNuevaPlataforma(e.target.value)} />
</Modal>


    <Modal
  title="Agregar nuevo lugar de secuenciación"
  visible={modalLugarVisible}
  onOk={() => {
    if (nuevoLugar) {
      setLugaresSecuenciacion([...lugaresSecuenciacion, nuevoLugar]);
      form.setFieldsValue({ lugarSecuenciacion: nuevoLugar });
      setNuevoLugar('');
      setModalLugarVisible(false);
    }
  }}
  onCancel={() => {
    setNuevoLugar('');
    setModalLugarVisible(false);
  }}
>
  <Input value={nuevoLugar} onChange={e => setNuevoLugar(e.target.value)} />
</Modal>
 <Modal
        open={modalVisibleImages}
        title="Agregar descripción"
        onOk={handleModalOk}
        onCancel={() => setModalVisibleModal(false)}
        okText="Siguiente"
      >
        {currentEditing !== null && (
          <>
            <img
              src={imagesData[currentEditing].base64}
              alt="Imagen actual"
              style={{ maxWidth: "100%", marginBottom: "1rem" }}
            />
            <Input.TextArea
              rows={4}
              value={currentDescription}
              onChange={(e) => setCurrentDescription(e.target.value)}
              placeholder="Escribe la descripción aquí"
            />
          </>
        )}
      </Modal>
<Modal
        title={`Selecciona los encabezados del archivo: ${archivoActual}`}
        visible={visibleModal}
        onOk={handleOk}
        onCancel={() => setVisibleModal(false)}
        width={700}
        bodyStyle={{ maxHeight: "60vh", overflowY: "auto" }}
      >
        <Checkbox
          indeterminate={
            seleccionados.length > 0 && seleccionados.length < encabezados.length
          }
          checked={seleccionados.length === encabezados.length}
          onChange={(e) => {
            setSeleccionados(
              e.target.checked ? encabezados.map((item) => item.encabezado) : []
            );
          }}
          style={{ marginBottom: 8 }}
        >
          Seleccionar todos
        </Checkbox>

        <Checkbox.Group
          value={seleccionados}
          onChange={setSeleccionados}
          style={{ display: "flex", flexDirection: "column", gap: 4 }}
        >
          {encabezados.map((item, idx) => (
            <Checkbox key={idx} value={item.encabezado}>
              {item.encabezado}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </Modal>
        
  <Modal
    title={`Selecciona los encabezados del archivo: ${archivoActual_se}`}
    visible={visibleModal_SE}
    onOk={handleOk_SE}
    onCancel={() => setVisibleModal_SE(false)}
    width={700}
    bodyStyle={{ maxHeight: "60vh", overflowY: "auto" }}
  >
    <Checkbox
      indeterminate={
        seleccionados.length > 0 && seleccionados.length < encabezados_se.length
      }
      checked={seleccionados.length === encabezados_se.length}
      onChange={(e) => {
        setSeleccionados(
          e.target.checked ? encabezados_se.map((item) => item.encabezado) : []
        );
      }}
      style={{ marginBottom: 8 }}
    >
      Seleccionar todos
    </Checkbox>

    <Checkbox.Group
      value={seleccionados}
      onChange={setSeleccionados}
      style={{ display: "flex", flexDirection: "column", gap: 4 }}
    >
      {encabezados_se.map((item, idx) => (
        <Checkbox key={idx} value={item.encabezado}>
          {item.encabezado}
        </Checkbox>
      ))}
    </Checkbox.Group>
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
