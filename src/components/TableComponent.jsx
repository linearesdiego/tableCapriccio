import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const TableComponent = () => {
  const [data, setData] = useState(() => {
    const storedData = localStorage.getItem('tableData');
    return storedData ? JSON.parse(storedData) : [];
  });

  const [newRow, setNewRow] = useState({ maxima: '', primera: '', segunda: '', tercera: '' });

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

  // Calcular la cantidad de personas en cada categoría
  const countMaxima = data.filter((row) => row.maxima).length;
  const countPrimera = data.filter((row) => row.primera).length;
  const countSegunda = data.filter((row) => row.segunda).length;
  const countTercera = data.filter((row) => row.tercera).length;

  // Total de todas las personas
  const totalPersons = countMaxima + countPrimera + countSegunda + countTercera;

  // Exportar a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Tabla Dinámica', 14, 10);
    doc.autoTable({
      head: [['MAXIMA', '1RA', '2DA', '3RA']],
      body: data.map((row) => [row.maxima, row.primera, row.segunda, row.tercera]),
    });
    doc.save('tabla-dinamica.pdf');
  };

  // Exportar a Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tabla Dinámica');
    XLSX.writeFile(workbook, 'tabla-dinamica.xlsx');
  };

  const columns = React.useMemo(
    () => [
      { Header: 'MAXIMA', accessor: 'maxima', bgColor:'#fee440' },
      { Header: '1RA', accessor: 'primera' },
      { Header: '2DA', accessor: 'segunda' },
      { Header: '3RA', accessor: 'tercera' },
    ],
    []
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
               // Definir colores para cada columna (puedes personalizar estos colores)
               const colors = ['bg-[#ffbd00]', 'bg-[#353535]', 'bg-[#0081a7]', 'bg-[#6b9080]'];
               
               return (
                 <th
                   {...column.getHeaderProps()}
                   className={`border border-gray-300 p-2 text-left ${colors[index]}`}
                   key={column.id}
                   style={{ color: 'white' }} // Para el texto en blanco
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


          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="#ffffff"><path d="M7 18v-2.5m0 0V14c0-.471 0-.707.154-.854C7.308 13 7.555 13 8.05 13h.7c.725 0 1.313.56 1.313 1.25S9.475 15.5 8.75 15.5zM21 13h-1.312c-.825 0-1.238 0-1.494.244s-.256.637-.256 1.423v.833m0 2.5v-2.5m0 0h2.187m-4.375 0c0 1.38-1.175 2.5-2.625 2.5c-.327 0-.49 0-.613-.067c-.291-.16-.262-.485-.262-.766v-3.334c0-.281-.03-.606.262-.766c.122-.067.286-.067.613-.067c1.45 0 2.625 1.12 2.625 2.5"/><path d="M15 22h-4.273c-3.26 0-4.892 0-6.024-.798a4.1 4.1 0 0 1-.855-.805C3 19.331 3 17.797 3 14.727v-2.545c0-2.963 0-4.445.469-5.628c.754-1.903 2.348-3.403 4.37-4.113C9.095 2 10.668 2 13.818 2c1.798 0 2.698 0 3.416.252c1.155.406 2.066 1.263 2.497 2.35C20 5.278 20 6.125 20 7.818V10"/><path d="M3 12a3.333 3.333 0 0 1 3.333-3.333c.666 0 1.451.116 2.098-.057A1.67 1.67 0 0 0 9.61 7.43c.173-.647.057-1.432.057-2.098A3.333 3.333 0 0 1 13 2"/></g></svg>
        </button>
        <button onClick={exportToExcel} className="bg-green-600 text-white font-bold p-2 rounded flex items-center gap-4">
          Descargar Excel


          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><g fill="none" stroke="#ffffff" stroke-linecap="round" stroke-width="4"><path stroke-linejoin="round" d="M8 15V6a2 2 0 0 1 2-2h28a2 2 0 0 1 2 2v36a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-9"/><path d="M31 15h3m-6 8h6m-6 8h6"/><path stroke-linejoin="round" d="M4 15h18v18H4zm6 6l6 6m0-6l-6 6"/></g></svg>
        </button>
      </div>
    </div>
  );
};

export default TableComponent;
