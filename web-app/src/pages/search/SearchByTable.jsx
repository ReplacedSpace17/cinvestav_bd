import React, { useEffect, useState } from 'react';
import {
  Table,
  Select,
  Button,
  Space,
  Modal,
  Tabs,
  Typography,
  Descriptions,
} from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import jsonData from './example.json';

const { Option } = Select;
const { TabPane } = Tabs;
const { Title } = Typography;

const BusquedaPorTabla = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    responsable: '',
    sitio: '',
    fecha: '',
    tipo: '',
  });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setData(jsonData);
    setFilteredData(jsonData);
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) => {
      return (
        (!filters.responsable || item.Responsable === filters.responsable) &&
        (!filters.sitio || item.Sitio === filters.sitio) &&
        (!filters.fecha || item.Fecha === filters.fecha) &&
        (!filters.tipo || item["Tipo de analisis"] === filters.tipo)
      );
    });
    setFilteredData(filtered);
  }, [filters, data]);
  

  const handleView = (record) => {
    setSelectedRecord(record);
    setVisible(true);
  };

  const uniqueValues = (key) => {
    return [...new Set(data.map((item) => item[key]).filter(Boolean))];
  };

  const renderSection = (obj) => {
    // Definir las claves para las que quieres crear el link
    const linkKeys = [
      'Carpeta de muestreo',
      'imagen_cepas_puras',
      'imagen_muestreo',
      'ufc'
    ];
  
    return (
      <Descriptions bordered column={1} size="small">
        {Object.entries(obj).map(([key, value]) => {
          if (typeof value === 'string') {
            if (linkKeys.includes(key)) {
              // Mostrar enlace con el prefijo + valor
              const url = `http://localhost:5173/lista-archivos/${value}`;
              return (
                <Descriptions.Item key={key} label={key}>
                  <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                </Descriptions.Item>
              );
            } else if (value.startsWith('http')) {
              // Mostrar enlaces que ya son URLs
              return (
                <Descriptions.Item key={key} label={key}>
                  <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
                </Descriptions.Item>
              );
            }
          }
          // Por defecto, mostrar el valor como texto
          return (
            <Descriptions.Item key={key} label={key}>
              {value !== null && value !== undefined ? value.toString() : ''}
            </Descriptions.Item>
          );
        })}
      </Descriptions>
    );
  };
  

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tipo de análisis',
      dataIndex: 'Tipo de analisis', // ✅ coincide con la clave del JSON
      key: 'tipo_analisis',
    },
    {
      title: 'Responsable',
      dataIndex: 'Responsable',
      key: 'Responsable',
    },
    {
      title: 'Fecha',
      dataIndex: 'Fecha', // ✅ clave exacta del JSON
      key: 'fecha',
    },
    {
      title: 'Sitio',
      dataIndex: 'Sitio', // ✅ clave exacta del JSON
      key: 'sitio',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
      ),
    },
  ];
  

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <Title level={4}>Búsqueda por tabla</Title>
      <Space style={{ marginBottom: 16 }} wrap>
        <Select
          allowClear
          placeholder="Responsable"
          style={{ width: 200 }}
          value={filters.responsable || undefined}
          onChange={(value) => setFilters({ ...filters, responsable: value })}
        >
          {uniqueValues('Responsable').map((val) => (
            <Option key={val} value={val}>
              {val}
            </Option>
          ))}
        </Select>
        <Select
          allowClear
          placeholder="Lugar"
          style={{ width: 200 }}
          value={filters.sitio || undefined}
          onChange={(value) => setFilters({ ...filters, sitio: value })}
        >
          {uniqueValues('Sitio').map((val) => (
            <Option key={val} value={val}>
              {val}
            </Option>
          ))}
        </Select>
        <Select
          allowClear
          placeholder="Fecha"
          style={{ width: 150 }}
          value={filters.fecha || undefined}
          onChange={(value) => setFilters({ ...filters, fecha: value })}
        >
          {uniqueValues('Fecha').map((val) => (
            <Option key={val} value={val}>
              {val}
            </Option>
          ))}
        </Select>
        <Select
          allowClear
          placeholder="Tipo de análisis"
          style={{ width: 200 }}
          value={filters.tipo || undefined}
          onChange={(value) => setFilters({ ...filters, tipo: value })}
        >
          {uniqueValues('Tipo de analisis').map((val) => (
            <Option key={val} value={val}>
              {val}
            </Option>
          ))}
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={800}
        title={`Detalle del registro ${selectedRecord?.id}`}
      >
        <Tabs defaultActiveKey="1">
          {selectedRecord?.datos_generales && (
            <TabPane tab="Datos generales" key="1">
              {renderSection(selectedRecord.datos_generales)}
            </TabPane>
          )}
          {selectedRecord?.caracteristicas_muestra && (
            <TabPane tab="Características de muestra" key="2">
              {renderSection(selectedRecord.caracteristicas_muestra)}
            </TabPane>
          )}
          {selectedRecord?.informacion_sitio && (
            <TabPane tab="Información del sitio" key="3">
              {renderSection(selectedRecord.informacion_sitio)}
            </TabPane>
          )}
          {selectedRecord?.datos_secuencia && (
            <TabPane tab="Datos de secuencia" key="4">
              {renderSection(selectedRecord.datos_secuencia)}
            </TabPane>
          )}
          {selectedRecord?.datos_administrativos && (
            <TabPane tab="Datos administrativos" key="5">
              {renderSection(selectedRecord.datos_administrativos)}
            </TabPane>
          )}
          {selectedRecord?.enlaces && (
            <TabPane tab="Enlaces" key="6">
              {renderSection(selectedRecord.enlaces)}
            </TabPane>
          )}
        </Tabs>
      </Modal>
    </div>
  );
};

export default BusquedaPorTabla;
