import React, { useEffect, useState, useRef } from 'react';
import { Select, Space, Typography, Modal, Button, Tabs, Descriptions } from 'antd';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import jsonData from './example.json';

const { Option } = Select;
const { Title } = Typography;
const { TabPane } = Tabs;

const GrafoDeAnalisis = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    responsable: '',
    sitio: '',
    fecha: '',
    tipo: '',
  });
  const [selectedNode, setSelectedNode] = useState(null);
  const fgRef = useRef();

  useEffect(() => {
    setData(jsonData);
    setFilteredData(jsonData);
  }, []);

  useEffect(() => {
    const filtered = data.filter(item => {
      return (
        (!filters.responsable || item.Responsable === filters.responsable) &&
        (!filters.sitio || item.Sitio === filters.sitio) &&
        (!filters.fecha || item.Fecha === filters.fecha) &&
        (!filters.tipo || item["Tipo de analisis"] === filters.tipo)
      );
    });
    setFilteredData(filtered);
  }, [filters, data]);

  const nodes = filteredData.map(item => ({
    id: item.id,
    name: `ID: ${item.id}\nResponsable: ${item.Responsable}\nTipo: ${item["Tipo de analisis"]}\nFecha: ${item.Fecha}`,
    responsable: item.Responsable,
    sitio: item.Sitio,
    fecha: item.Fecha,
    tipo_analisis: item["Tipo de analisis"],
    rawData: item,
  }));

  const links = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].responsable === nodes[j].responsable) {
        links.push({ source: nodes[i].id, target: nodes[j].id });
      }
    }
  }

  const graphData = { nodes, links };

  const uniqueValues = (key) => {
    return [...new Set(data.map(item => item[key]).filter(Boolean))];
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

  return (
    <div style={{ padding: 24, background: '#fff' }}>
      <Title level={4}>Visualización en Grafo de Análisis</Title>

      <Space style={{ marginBottom: 16 }} wrap>
        <Select
          allowClear
          placeholder="Responsable"
          style={{ width: 200 }}
          value={filters.responsable || undefined}
          onChange={value => setFilters({ ...filters, responsable: value })}
        >
          {uniqueValues('Responsable').map(val => (
            <Option key={val} value={val}>{val}</Option>
          ))}
        </Select>

        <Select
          allowClear
          placeholder="Lugar"
          style={{ width: 200 }}
          value={filters.sitio || undefined}
          onChange={value => setFilters({ ...filters, sitio: value })}
        >
          {uniqueValues('Sitio').map(val => (
            <Option key={val} value={val}>{val}</Option>
          ))}
        </Select>

        <Select
          allowClear
          placeholder="Fecha"
          style={{ width: 150 }}
          value={filters.fecha || undefined}
          onChange={value => setFilters({ ...filters, fecha: value })}
        >
          {uniqueValues('Fecha').map(val => (
            <Option key={val} value={val}>{val}</Option>
          ))}
        </Select>

        <Select
          allowClear
          placeholder="Tipo de análisis"
          style={{ width: 200 }}
          value={filters.tipo || undefined}
          onChange={value => setFilters({ ...filters, tipo: value })}
        >
          {uniqueValues('Tipo de analisis').map(val => (
            <Option key={val} value={val}>{val}</Option>
          ))}
        </Select>
      </Space>

      <div style={{ height: 600, border: '1px solid #ccc' }}>
        <ForceGraph3D
          ref={fgRef}
          backgroundColor="#f5f5f5"
          graphData={graphData}
          nodeAutoColorBy="responsable"
          linkWidth={1}
          linkColor={() => '#888'}
          linkDirectionalArrowLength={3}
          linkDirectionalArrowRelPos={1}
          nodeThreeObject={node => {
            const group = new THREE.Group();
            const geometry = new THREE.SphereGeometry(5);
            const material = new THREE.MeshBasicMaterial({ color: node.color || '#1f77b4' });
            const sphere = new THREE.Mesh(geometry, material);
            group.add(sphere);

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 250;
            canvas.height = 100;
            ctx.fillStyle = 'black';
            ctx.font = 'bold 14px Arial';
            const lines = node.name.split('\n');
            lines.forEach((line, i) => {
              ctx.fillText(line, 10, 20 + i * 18);
            });

            const texture = new THREE.CanvasTexture(canvas);
            const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.position.set(0, -10, 0);
            sprite.scale.set(35, 15, 1);
            group.add(sprite);
            return group;
          }}
          onNodeClick={node => setSelectedNode(node)}
        />
      </div>

      <Modal
        open={!!selectedNode}
        onCancel={() => setSelectedNode(null)}
        footer={null}
        width={800}
        title={`Detalle del registro ${selectedNode?.id}`}
      >
        <Tabs defaultActiveKey="1">
          {selectedNode?.rawData?.datos_generales && (
            <TabPane tab="Datos generales" key="1">
              {renderSection(selectedNode.rawData.datos_generales)}
            </TabPane>
          )}
          {selectedNode?.rawData?.caracteristicas_muestra && (
            <TabPane tab="Características de muestra" key="2">
              {renderSection(selectedNode.rawData.caracteristicas_muestra)}
            </TabPane>
          )}
          {selectedNode?.rawData?.informacion_Sitio && (
            <TabPane tab="Información del sitio" key="3">
              {renderSection(selectedNode.rawData.informacion_Sitio)}
            </TabPane>
          )}
          {selectedNode?.rawData?.datos_Secuencia && (
            <TabPane tab="Datos de secuencia" key="4">
              {renderSection(selectedNode.rawData.datos_Secuencia)}
            </TabPane>
          )}
          {selectedNode?.rawData?.datos_administrativos && (
            <TabPane tab="Datos administrativos" key="5">
              {renderSection(selectedNode.rawData.datos_administrativos)}
            </TabPane>
          )}
          {selectedNode?.rawData?.enlaces && (
            <TabPane tab="Enlaces" key="6">
              {renderSection(selectedNode.rawData.enlaces)}
            </TabPane>
          )}
        </Tabs>
        <Button onClick={() => navigator.clipboard.writeText(selectedNode.id)}>Copiar ID</Button>
      </Modal>
    </div>
  );
};

export default GrafoDeAnalisis;
