import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './components/home';
import { Profile } from './components/profile';
import { Events } from './components/events';
import { Marketplace } from './components/marketplace';
import { Benefits } from './components/benefits';
import { PruebaDb } from './components/pruebadb';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/perfil" element={<Profile />} /> 
        <Route path="/eventos" element={<Events />} /> 
        <Route path="/mercado" element={<Marketplace />} /> 
        <Route path="/beneficios" element={<Benefits />} /> 
        <Route path="/prueba" element={<PruebaDb />} /> 
      </Routes>
    </Router>
  );
};

export default App;
