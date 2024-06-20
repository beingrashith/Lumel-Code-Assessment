import React, { useState, useEffect } from 'react';
import '../component/Table.css';

const initialData = [
  {
    id: 'electronics',
    label: 'Electronics',
    value: 0,
    originalValue: 0,
    children: [
      {
        id: 'phones',
        label: 'Phones',
        value: 800,
        originalValue: 800,
      },
      {
        id: 'laptops',
        label: 'Laptops',
        value: 700,
        originalValue: 700,
      },
    ],
  },
  {
    id: 'furniture',
    label: 'Furniture',
    value: 0,
    originalValue: 0,
    children: [
      {
        id: 'tables',
        label: 'Tables',
        value: 300,
        originalValue: 300,
      },
      {
        id: 'chairs',
        label: 'Chairs',
        value: 700,
        originalValue: 700,
      },
    ],
  },
];

const Table = () => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const updatedData = data.map((item) => ({
      ...item,
      value: item.children.reduce((sum, child) => sum + child.value, 0),
      originalValue: item.children.reduce((sum, child) => sum + child.originalValue, 0),
    }));
    setData(updatedData);
  }, [data]);

  const handleAllocationPercent = (id, percent) => {
    const updateValues = (items) =>
      items.map((item) => {
        if (item.id === id) {
          const newValue = item.value + (item.value * percent) / 100;
          return { ...item, value: newValue };
        }
        if (item.children) {
          return { ...item, children: updateValues(item.children) };
        }
        return item;
      });

    const updatedData = updateValues(data).map((item) => ({
      ...item,
      value: item.children.reduce((sum, child) => sum + child.value, 0),
    }));
    setData(updatedData);
  };

  const handleAllocationValue = (id, newValue) => {
    const updateValues = (items) =>
      items.map((item) => {
        if (item.id === id) {
          return { ...item, value: newValue };
        }
        if (item.children) {
          return { ...item, children: updateValues(item.children) };
        }
        return item;
      });

    const updatedData = updateValues(data).map((item) => ({
      ...item,
      value: item.children.reduce((sum, child) => sum + child.value, 0),
    }));
    setData(updatedData);
  };

 
  const renderTable = (items, level = 0) =>
    items.map((item) => (
      <React.Fragment key={item.id}>
        <tr>
          <td style={{ paddingLeft: `${level * 20}px` }}>{item.label}</td>
          <td>{item.value}</td>
          <td>
            <input
              type="number"
              value={item.value}
              onChange={(e) => handleAllocationValue(item.id, parseFloat(e.target.value))}
            />
          </td>
          <td>
            <button onClick={() => handleAllocationPercent(item.id, 10)}>Allocation %</button>
          </td>
          <td>
            <button onClick={() => handleAllocationValue(item.id, item.value)}>Allocation Val</button>
          </td>
          <td>{((item.value - item.originalValue) / item.originalValue) * 100}%</td>
        </tr>
        {item.children && renderTable(item.children, level + 1)}
      </React.Fragment>
    ));

  return (
    <div>
      <table className="hierarchical-table">
        <thead>
          <tr>
            <th>Label</th>
            <th>Value</th>
            <th>Input</th>
            <th>Allocation %</th>
            <th>Allocation Val</th>
            <th>Variance %</th>
          </tr>
        </thead>
        <tbody>
          {renderTable(data)}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
