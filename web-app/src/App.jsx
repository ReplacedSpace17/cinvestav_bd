// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Genomica from './pages/Genomica';
import Example from './pages/Example';
import XVI_S from './pages/16s';
import XVI_S_articulo from './pages/16sArticulo';
import XVIII_S from './pages/18s';
import ITS from './pages/ITS';
import Metagenomas from './pages/Metagenomas';
import ListaArchivos from './pages/files/ListaArchivos'; // Import the ListaArchivos component
import CustomSelect from './pages/Test';
import Inicio from './pages/Menu'; // Import the Menu component
import BusquedaPorTabla from './pages/search/SearchByTable'; // Import the SearchByTable component
import BusquedaPorGrafo from './pages/search/SearchByGrafo'; // Import the SearchByGrafo component
import React from 'react';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/menu" element={<Inicio />} /> {/* Add the Menu route */}
      <Route path="/genomica" element={<Genomica />} />
      <Route path="/16s" element={<XVI_S />} />
      <Route path="/16s_articulo" element={<XVI_S_articulo />} />
      <Route path="/18s" element={<XVIII_S />} />
      <Route path="/its" element={<ITS />} />
      <Route path="/metagenomas" element={<Metagenomas />} />
      <Route path="/search-by-table" element={<BusquedaPorTabla />} /> {/* Add the SearchByTable route */}
      <Route path="/search-by-grafo" element={<BusquedaPorGrafo />} /> {/* Add the SearchByGrafo route */}
      <Route path="/lista-archivos/*" element={<ListaArchivos />} />



      {/* Add the CustomSelect route */}
      <Route path="/custom-select" element={<CustomSelect />} />
      {/* Add the Example route */}
      
      
      <Route path="/example" element={<Example />} />
     
    </Routes>
  </BrowserRouter>
);

export default App;
