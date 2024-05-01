import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './components/Home/Home';
import { Profile } from './components/profile';
import { Eventos } from './components/Eventos/Eventos';
import { Marketplace } from './components/marketplace';
import { Beneficios } from './components/beneficios';
import { PruebaDb } from './components/pruebadb';
import { Login } from './components/login';
import { EventoPage } from "./components/Eventos/EventoPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/perfil" element={<Profile />} /> 
        <Route path="/eventos" element={<Eventos />} /> 
        <Route path="/mercado" element={<Marketplace />} /> 
        <Route path="/beneficios" element={<Beneficios />} /> 
        <Route path="/prueba" element={<PruebaDb />} /> 
        <Route path="/login" element={<Login />} /> 
        <Route path="/evento/:id" element={<EventoPage/>} /> 

      </Routes>
    </Router>
  );
};

export default App;
