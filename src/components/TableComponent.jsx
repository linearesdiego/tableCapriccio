import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import logo from '../assets/logo.webp'

const TableComponent = () => {
  const [data, setData] = useState(() => {
    const storedData = localStorage.getItem('tableData');
    return storedData ? JSON.parse(storedData) : [];
  });

  const [newRow, setNewRow] = useState({ maxima: '', primera: '', segunda: '', tercera: '' });

  const [editingCell, setEditingCell] = useState(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    localStorage.setItem('tableData', JSON.stringify(data));
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRow = () => {
    if (newRow.maxima || newRow.primera || newRow.segunda || newRow.tercera) {
      setData((prevData) => [...prevData, newRow]);
      setNewRow({ maxima: '', primera: '', segunda: '', tercera: '' });
    } else {
      alert('Por favor, completa al menos un campo');
    }
  };

  const countMaxima = data.filter((row) => row.maxima).length;
  const countPrimera = data.filter((row) => row.primera).length;
  const countSegunda = data.filter((row) => row.segunda).length;
  const countTercera = data.filter((row) => row.tercera).length;
  const totalPersons = countMaxima + countPrimera + countSegunda + countTercera;

  const exportToPDF = () => {
    // ... Código para exportar a PDF ...
  };

  const exportToExcel = async () => {
    // ... Código para exportar a Excel ...
  };

  const handleDeleteField = (rowIndex, fieldName) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex][fieldName] = ''; // Eliminar solo el campo específico
      return newData;
    });
  };

  const handleCellDoubleClick = (rowIndex, columnId, value) => {
    setEditingCell({ rowIndex, columnId });
    setInputValue(value);
  };

  const handleCellBlur = () => {
    if (editingCell) {
      const { rowIndex, columnId } = editingCell;
      setData((prevData) => {
        const newData = [...prevData];
        newData[rowIndex][columnId] = inputValue;
        return newData;
      });
      setEditingCell(null);
      setInputValue('');
    }
  };

  const handleCellKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCellBlur();
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'MAXIMA',
        accessor: 'maxima',
        Cell: ({ row }) => (
          <div
            className="flex items-center justify-between"
            onDoubleClick={() => handleCellDoubleClick(row.index, 'maxima', row.values.maxima)}
          >
            {editingCell && editingCell.rowIndex === row.index && editingCell.columnId === 'maxima' ? (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleCellBlur}
                onKeyDown={handleCellKeyDown}
                autoFocus
                className="border p-1"
              />
            ) : (
              row.values.maxima
            )}
            {row.values.maxima && !editingCell && (
              <button
                onClick={() => handleDeleteField(row.index, 'maxima')}
                className="text-red-500 text-xs ml-2 hover:bg-red-500 hover:text-white p-1 rounded"
              >
                x
              </button>
            )}
          </div>
        ),
      },
      
      {
        Header: '1RA',
        accessor: 'primera',  
        Cell: ({ row }) => (
          <div
            className="flex items-center justify-between"
            onDoubleClick={() => handleCellDoubleClick(row.index, 'primera', row.values.primera)}
          >
            {editingCell && editingCell.rowIndex === row.index && editingCell.columnId === 'primera' ? (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleCellBlur}
                onKeyDown={handleCellKeyDown}
                autoFocus
                className="border p-1"
              />
            ) : (
              row.values.primera
            )}
            {row.values.primera && !editingCell && (
              <button
                onClick={() => handleDeleteField(row.index, 'primera')}
                className="text-red-500 text-xs ml-2 hover:bg-red-500 hover:text-white p-1 rounded"
              >
                x
              </button>
            )}
          </div>
        ),
      },
      {
        Header: '2DA',
        accessor: 'segunda',
        Cell: ({ row }) => (
          <div
            className="flex items-center justify-between"
            onDoubleClick={() => handleCellDoubleClick(row.index, 'segunda', row.values.segunda)}
          >
            {editingCell && editingCell.rowIndex === row.index && editingCell.columnId === 'segunda' ? (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleCellBlur}
                onKeyDown={handleCellKeyDown}
                autoFocus
                className="border p-1"
              />
            ) : (
              row.values.segunda
            )}
            {row.values.segunda && !editingCell && (
              <button
                onClick={() => handleDeleteField(row.index, 'segunda')}
                className="text-red-500 text-xs ml-2 hover:bg-red-500 hover:text-white p-1 rounded"
              >
                x
              </button>
            )}
          </div>
        ),
      },
      {
        Header: '3RA',
        accessor: 'tercera',
        Cell: ({ row }) => (
          <div
            className="flex items-center justify-between"
            onDoubleClick={() => handleCellDoubleClick(row.index, 'tercera', row.values.tercera)}
          >
            {editingCell && editingCell.rowIndex === row.index && editingCell.columnId === 'tercera' ? (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleCellBlur}
                onKeyDown={handleCellKeyDown}
                autoFocus
                className="border p-1"
              />
            ) : (
              row.values.tercera
            )}
            {row.values.tercera && !editingCell && (
              <button
                onClick={() => handleDeleteField(row.index, 'tercera')}
                className="text-red-500 text-xs ml-2 hover:bg-red-500 hover:text-white p-1 rounded"
              >
                x
              </button>
            )}
          </div>
        ),

      },
      {
        Header: 'Acciones',
        accessor: 'actions',
        Cell: ({ row }) => (
          <button
            onClick={() => {
              setData((prevData) => {
                const newData = [...prevData];
                newData.splice(row.index, 1);
                return newData;
              });
            }}
            className="bg-red-500 text-white p-2 rounded"
          >
            Eliminar
          </button>
        ),
      }
    ],
    [editingCell, inputValue]
  );

  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    <div className="container mx-auto p-4">
      {/* Formulario para agregar nueva fila */}
      <div className="mb-4">
        <input
          name="maxima"
          value={newRow.maxima}
          onChange={handleInputChange}
          placeholder="Maxima"
          className="border p-2 mr-2"
        />
        <input
          name="primera"
          value={newRow.primera}
          onChange={handleInputChange}
          placeholder="1RA"
          className="border p-2 mr-2"
        />
        <input
          name="segunda"
          value={newRow.segunda}
          onChange={handleInputChange}
          placeholder="2DA"
          className="border p-2 mr-2"
        />
        <input
          name="tercera"
          value={newRow.tercera}
          onChange={handleInputChange}
          placeholder="3RA"
          className="border p-2 mr-2"
        />
        <button onClick={handleAddRow} className="bg-blue-500 text-white p-2 rounded">
          Agregar Fila
        </button>
      </div>

      {/* Tabla */}
      <table {...getTableProps()} className="table-auto w-full border-collapse border border-gray-300 mb-4">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column, index) => {
                const colors = ['bg-[#ffbd00]', 'bg-[#353535]', 'bg-[#0081a7]', 'bg-[#6b9080]', 'bg-[#a4c3b2]'];
                return (
                  <th
                    {...column.getHeaderProps()}
                    className={`border border-gray-300 p-2 text-left ${colors[index]}`}
                    key={column.id}
                    style={{ color: 'white' }}
                  >
                    {column.render('Header')}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id} className="hover:bg-gray-100">
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="border border-gray-300 p-2" key={cell.column.id}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}

          {/* Fila de conteo */}
          <tr className="bg-gray-200 font-bold">
            <td className="border border-gray-300 p-2">{countMaxima}</td>
            <td className="border border-gray-300 p-2">{countPrimera}</td>
            <td className="border border-gray-300 p-2">{countSegunda}</td>
            <td className="border border-gray-300 p-2">{countTercera}</td>
          </tr>

          {/* Fila del total */}
          <tr className="bg-gray-300 font-bold">
            <td className="border border-gray-300 p-2">Total Personas:</td>
            <td colSpan="4" className="border border-gray-300 p-2 text-center">
              {totalPersons}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Botones de descarga */}
      <div className="flex gap-4">
        <button onClick={exportToPDF} className="bg-red-600 text-white p-2 rounded flex items-center gap-4 font-bold">
          Descargar PDF
          {/* SVG del botón */}
        </button>
        <button onClick={exportToExcel} className="bg-green-600 text-white font-bold p-2 rounded flex items-center gap-4">
          Descargar Excel
          {/* SVG del botón */}
        </button>
      </div>
    </div>
  );
};

export default TableComponent;
