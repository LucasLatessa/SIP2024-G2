import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './components/Home/Home';
import { Profile } from './components/profile';
import { Events } from './components/events';
import { Marketplace } from './components/marketplace';
import { Beneficios } from './components/beneficios';
import { PruebaDb } from './components/pruebadb';
import { Users } from './components/users';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/perfil" element={<Profile />} /> 
        <Route path="/eventos" element={<Events />} /> 
        <Route path="/mercado" element={<Marketplace />} /> 
        <Route path="/beneficios" element={<Beneficios />} /> 
        <Route path="/prueba" element={<PruebaDb />} /> 
        <Route path="/validarusuario" element={<Users />} /> 

      </Routes>
    </Router>
  );
};

export default App;
