import React, { useState } from "react";
import { Form, Button, Upload, Card, Typography, message, List, Modal, Input } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;
const { Title } = Typography;

const Example2 = () => {
  const [fileList, setFileList] = useState([]);
  const [imagesData, setImagesData] = useState([]); // { name, base64, description }
  const [showImages, setShowImages] = useState(false);
  const [modalVisibleImages, setModalVisibleModal] = useState(false);
  const [currentEditing, setCurrentEditing] = useState(null); 
  const [currentDescription, setCurrentDescription] = useState("");

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

  // Guardar descripción y pasar a la siguiente
  const handleModalOk = () => {
    const newImagesData = [...imagesData];
    newImagesData[currentEditing].description = currentDescription;
    setImagesData(newImagesData);

    if (currentEditing < imagesData.length - 1) {
      // abrir modal siguiente
      handleAddDescription(currentEditing + 1);
    } else {
      // última imagen -> cerrar modal y mostrar JSON
      setModalVisibleModal(false);
      message.success("✅ Todas las descripciones agregadas");
      console.log("JSON final:", newImagesData);
    }

    setCurrentDescription("");
  };

  return (
    <Card
      title={<Title level={4}>Subir imágenes con descripción</Title>}
      style={{ maxWidth: 800, margin: "2rem auto" }}
    >
      <Form layout="vertical">
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

        {/* Botón 1: Convertir a String (y pedir descripciones) */}
        <Button type="primary" onClick={handleConvertToString} block>
          Convertir a String
        </Button>

        {/* Botón 2: Mostrar imágenes */}
        <Button
          style={{ marginTop: "1rem" }}
          onClick={handleShowImages}
          block
        >
          Mostrar Imágenes
        </Button>
      </Form>

      {showImages && imagesData.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={imagesData}
            renderItem={(item) => (
              <List.Item>
                <Card title={item.name} bordered>
                  <img
                    src={item.base64}
                    alt={item.name}
                    style={{ maxWidth: "100%", borderRadius: "8px" }}
                  />
                  {item.description && (
                    <p style={{ marginTop: "0.5rem" }}>
                      <strong>Descripción:</strong> {item.description}
                    </p>
                  )}
                </Card>
              </List.Item>
            )}
          />
        </div>
      )}

      {/* Modal de descripciones en secuencia */}
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
    </Card>
  );
};

export default Example2;
