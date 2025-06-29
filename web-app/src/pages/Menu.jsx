import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Button,
  Typography,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  SettingOutlined,
  PlusOutlined, SearchOutlined
} from '@ant-design/icons';

import '../App.css'; // Import your CSS file for custom styles
import Genomica from './Genomica';
import Example from './Example';
import XVI_S from './16s';
import XVI_S_articulo from './16sArticulo';
import XVIII_S from './18s';
import ITS from './ITS';
import Metagenomas from './Metagenomas';
import ListaArchivos from './files/ListaArchivos'; // Import the ListaArchivos component
import BusquedaPorTabla from './search/SearchByTable'; // Import the SearchByTable component
import GrafoDeAnalisis from './search/SearchByGrafo'; // Import the SearchByGrafo component

const { Header, Sider, Content } = Layout;
const { Title } = Typography;
const { SubMenu } = Menu;

const Inicio = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('0');

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
  };

  const keyToTitle = {
    '0': 'Inicio',
    '1': 'Agregar análisis / Genómica',
    '2': 'Agregar análisis / 16s',
    '3': 'Agregar análisis / 16s Artículo',
    '4': 'Agregar análisis / 18s',
    '5': 'Agregar análisis / Metagenomas',
    '6': 'Agregar análisis / ITS',
    '7': 'Buscar / Tabla',
    '8': 'Buscar / Grafo',
  };
  
  
  const componentMap = {
    '1': <Genomica />,
    '2': <XVI_S />,
    '3': <XVI_S_articulo />,
    '4': <XVIII_S />,
    '5': <Metagenomas />,
    '6': <ITS />,
    '7': <BusquedaPorTabla />, // por ejemplo, tabla
    '8': <GrafoDeAnalisis />, // por ejemplo, grafo
  };
  

  const primaryColor = '#182538'; // gris azulado personalizado
  const secondaryColor = '#1F2A44'; // gris azulado más claro
  return (
    <Layout style={{ minHeight: '100vh', width: '100%' }}>

      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        style={{ background: primaryColor }}
      >
        <div 
          className="logo" 
          style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0)', borderRadius: 6 }} 
        />
        <Menu 
          theme="dark" 
          mode="inline" 
          defaultSelectedKeys={[selectedKey]} 
          onClick={handleMenuClick}
          style={{ background: primaryColor }}
        >
          <SubMenu key="sub1" icon={<PlusOutlined />} title="Agregar análisis">
            <Menu.Item key="1">Genómica</Menu.Item>
            <Menu.Item key="2">16s</Menu.Item>
            <Menu.Item key="3">16s Artículo</Menu.Item>
            <Menu.Item key="4">18s</Menu.Item>
            <Menu.Item key="5">Metagenomas</Menu.Item>
            <Menu.Item key="6">ITS</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<SearchOutlined />} title="Buscar">
            <Menu.Item key="7">Tabla</Menu.Item>
            <Menu.Item key="8">Grafo</Menu.Item>
          </SubMenu>
          
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: primaryColor, display: 'flex', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined style={{ color: '#fff' }} /> : <MenuFoldOutlined style={{ color: '#fff' }} />}
            onClick={toggleCollapsed}
            style={{ fontSize: '18px', width: 64, height: 64 }}
          />
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            {keyToTitle[selectedKey] || 'Inicio'}
          </Title>
        </Header>
        <Content
  style={{
    margin: '24px 16px',
    padding: 24,
    background: '#fff',
    height: '100%',
    overflow: 'auto',
  }}
>
  <Title level={4}>{keyToTitle[selectedKey] || 'Inicio'}</Title>
  {componentMap[selectedKey] || <p>Selecciona una opción del menú lateral para comenzar.</p>}
</Content>


      </Layout>
    </Layout>
  );
};

export default Inicio;
