import React, { useState } from 'react';
import { Select, Modal, Input, Button } from 'antd';

const { Option } = Select;

const CustomSelect = () => {
  const [items, setItems] = useState(['Manzana', 'Plátano', 'Naranja']);
  const [selected, setSelected] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const showModal = () => {
    setNewItem(searchValue);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    setSelected(newItem);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const handleChange = (value) => {
    setSelected(value);
  };

  const isMatch = items.some(item => item.toLowerCase() === searchValue.toLowerCase());

  return (
    <>
      <Select
        showSearch
        placeholder="Selecciona o agrega"
        value={selected}
        onSearch={handleSearch}
        onChange={handleChange}
        style={{ width: 300 }}
        dropdownRender={menu => (
          <>
            {menu}
            {!isMatch && searchValue && (
              <div style={{ padding: 8 }}>
                <Button type="link" onClick={showModal}>
                  Agregar "{searchValue}"
                </Button>
              </div>
            )}
          </>
        )}
      >
        {items.map(item => (
          <Option key={item} value={item}>
            {item}
          </Option>
        ))}
      </Select>

      <Modal
        title="Agregar nuevo ítem"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Escribe el nuevo valor"
        />
      </Modal>
    </>
  );
};

export default CustomSelect;
