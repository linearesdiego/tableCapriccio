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
    const doc = new jsPDF();
    
    const imgPath = logo; // Ruta de la imagen en tu proyecto
    const img = new Image();
    img.src = imgPath;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const logoBase64 = canvas.toDataURL("image/png");
  
      // Obtener el ancho de la página y el ancho del logo
      const pageWidth = doc.internal.pageSize.getWidth();
      const logoWidth = 50; // Ajusta el tamaño del logo
      const xPosition = (pageWidth - logoWidth) / 2; // Centrado horizontalmente
  
      // Agregar el logo al PDF
      doc.addImage(logoBase64, 'PNG', xPosition, 10, logoWidth, 30); // Cambia la posición y el tamaño
  
      // Agregar título de la tabla
      doc.text('Tabla Categorias', 14, 50);
      
      // Agregar la tabla
      doc.autoTable({
        head: [['MAXIMA', '1RA', '2DA', '3RA']],
        body: data.map((row) => [row.maxima, row.primera, row.segunda, row.tercera]),
        startY: 60, // Para evitar superposición con el logo
      });
  
      // Agregar total
      doc.text(`Total Personas: ${totalPersons}`, 14, doc.lastAutoTable.finalY + 10);
      
      doc.save('tabla-dinamica.pdf');
    };
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tabla Dinámica');
  
    // Agregar encabezados
    worksheet.addRow(['MAXIMA', '1RA', '2DA', '3RA']);
  
    // Agregar datos
    data.forEach(row => {
      worksheet.addRow([row.maxima, row.primera, row.segunda, row.tercera]);
    });
  
    // Agregar totales
    worksheet.addRow(['Total Personas:', totalPersons]);
  
    // Cargar la imagen
    const imgPath = logo // Ruta de tu logo
    const img = await fetch(imgPath).then(res => res.blob());
    const imageId = workbook.addImage({
      buffer: await img.arrayBuffer(),
      extension: 'png',
    });
  
    // Insertar la imagen en la hoja de cálculo
    worksheet.addImage(imageId, {
      tl: { col: 10, row: 0 },
      ext: { width: 100, height: 50 }, // Tamaño de la imagen
    });
  
    // Guardar el archivo
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tabla-dinamica.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  const handleDeleteField = (rowIndex, fieldName) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex][fieldName] = ''; // Eliminar solo el campo específico
      return newData;
    });
  };
  const handleCellDoubleClick = (rowIndex, columnId) => {
    setEditingCell({ rowIndex, columnId });
    const value = data[rowIndex][columnId] || ''; // Si está vacío, usa una cadena vacía
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
            className="flex items-center justify-between h-10"
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
          className="flex items-center justify-between h-10"
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
          className="flex items-center justify-between h-10"
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
          className="flex items-center justify-between h-10"
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

          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="#ffffff"><path d="M7 18v-2.5m0 0V14c0-.471 0-.707.154-.854C7.308 13 7.555 13 8.05 13h.7c.725 0 1.313.56 1.313 1.25S9.475 15.5 8.75 15.5zM21 13h-1.312c-.825 0-1.238 0-1.494.244s-.256.637-.256 1.423v.833m0 2.5v-2.5m0 0h2.187m-4.375 0c0 1.38-1.175 2.5-2.625 2.5c-.327 0-.49 0-.613-.067c-.291-.16-.262-.485-.262-.766v-3.334c0-.281-.03-.606.262-.766c.122-.067.286-.067.613-.067c1.45 0 2.625 1.12 2.625 2.5"/><path d="M15 22h-4.273c-3.26 0-4.892 0-6.024-.798a4.1 4.1 0 0 1-.855-.805C3 19.331 3 17.797 3 14.727v-2.545c0-2.963 0-4.445.469-5.628c.754-1.903 2.348-3.403 4.37-4.113C9.095 2 10.668 2 13.818 2c1.798 0 2.698 0 3.416.252c1.155.406 2.066 1.263 2.497 2.35C20 5.278 20 6.125 20 7.818V10"/><path d="M3 12a3.333 3.333 0 0 1 3.333-3.333c.666 0 1.451.116 2.098-.057A1.67 1.67 0 0 0 9.61 7.43c.173-.647.057-1.432.057-2.098A3.333 3.333 0 0 1 13 2"/></g></svg>
        </button>
        <button onClick={exportToExcel} className="bg-green-600 text-white font-bold p-2 rounded flex items-center gap-4">
          Descargar Excel
          {/* SVG del botón */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><g fill="none" stroke="#ffffff" stroke-linecap="round" stroke-width="4"><path stroke-linejoin="round" d="M8 15V6a2 2 0 0 1 2-2h28a2 2 0 0 1 2 2v36a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-9"/><path d="M31 15h3m-6 8h6m-6 8h6"/><path stroke-linejoin="round" d="M4 15h18v18H4zm6 6l6 6m0-6l-6 6"/></g></svg>
        </button>
      </div>
    </div>
  );
};

export default TableComponent;
