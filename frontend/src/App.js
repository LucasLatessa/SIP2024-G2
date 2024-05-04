import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./components/Home/Home";
import { Profile } from "./components/profile";
import { Logup } from "./components/Logup";
import { Eventos } from "./components/Eventos/Eventos";
import { Marketplace } from "./components/Publicaciones/marketplace";
import { Beneficios } from "./components/Beneficios/Beneficios";
import { EventoPage } from "./components/Eventos/EventoPage";
import { PublicacionPage } from "./components/Publicaciones/PublicacionPage";
import { ProgramarEvento } from "./components/Eventos/ProgramarEvento";
import { Mercadopago } from "./components/mercadopago";
import { CrearBeneficio } from "./components/Beneficios/CrearBeneficio";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/mercado" element={<Marketplace />} />
        <Route path="/beneficios" element={<Beneficios />} />
        <Route path="/logup" element={<Logup />} />
        <Route path="/evento/:id" element={<EventoPage />} />
        <Route path="/publicacion/:id" element={<PublicacionPage />} />
        <Route path="/programarEvento" element={<ProgramarEvento />} />
        <Route path="/mercadopago" element={<Mercadopago />} />
        <Route path="/crearBeneficio" element={<CrearBeneficio />} />
      </Routes>
    </Router>
  );
}

export default App;
