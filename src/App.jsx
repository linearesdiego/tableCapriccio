import React from 'react';
import TableComponent from './components/TableComponent';
import logo from './assets/logo.webp'
function App() {
  return (
    <div className="App">
      <h1 className="text-2xl font-bold text-center my-4">Tabla categorias</h1>

      <div className="w-full flex items-center justify-center">
        <img src={logo} alt="" />
      </div>
      <TableComponent />
    </div>
  );
}

export default App;

