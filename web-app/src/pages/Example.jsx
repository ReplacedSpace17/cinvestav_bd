import React, { useState } from "react";
import {
  Form,
  Button,
  Upload,
  Card,
  Typography,
  message,
  Modal,
  Checkbox,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;
const { Title } = Typography;

const Example = () => {
  const [files_dataCrudos, setFile_datos_crudos] = useState([]);
  const [encabezados, setEncabezados] = useState([]);
  const [archivoActual, setArchivoActual] = useState(null);
  const [visibleModal, setVisibleModal] = useState(false);
  const [seleccionados, setSeleccionados] = useState([]);
  const [finalJSON, setFinalJSON] = useState({ url_datos_crudos: [] });
  const [archivoIndex, setArchivoIndex] = useState(0);

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
    return false;
  };
 const handleOk = () => {
    const seleccionadosFinal = encabezados.filter((item) =>
      seleccionados.includes(item.encabezado)
    );
    setFinalJSON((prev) => {
      const actualizado = {
        url_datos_crudos: [...prev.url_datos_crudos, ...seleccionadosFinal],
      };
      console.log("📦 JSON actualizado:", JSON.stringify(actualizado, null, 2));
      return actualizado;
    });

    setVisibleModal(false);
    setSeleccionados([]);

    // Procesar siguiente archivo si hay
    const nextIndex = archivoIndex + 1;
    if (nextIndex < files_dataCrudos.length) {
      setArchivoIndex(nextIndex);
      procesarArchivo(files_dataCrudos[nextIndex]);
    }
  };

  const handleSelectAll = () => {
    setSeleccionados(encabezados.map((e) => e.encabezado));
  };
  
  const onFinish = () => {
    if (files_dataCrudos.length === 0) {
      message.error("Debes subir al menos un archivo");
      return;
    }
    setArchivoIndex(0);
    procesarArchivo(files_dataCrudos[0]);
  };

 

  return (
    <>
      <Card
        title={<Title level={4}>Formulario de carga FASTA/FASTQ</Title>}
        style={{ maxWidth: 600, margin: "2rem auto" }}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Subir archivos" required>
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

          <Button type="primary" htmlType="submit" block>
            Aceptar
          </Button>
        </Form>
      </Card>

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
    </>
  );
};

export default Example;
