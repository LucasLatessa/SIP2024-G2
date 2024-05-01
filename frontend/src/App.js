import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./components/Home/Home";
import { Profile } from "./components/profile";
import { Logup } from "./components/Logup";
import { Eventos } from "./components/Eventos/Eventos";
import { Marketplace } from "./components/marketplace";
import { Beneficios } from "./components/beneficios";
import { PruebaDb } from "./components/pruebadb";
import { EventoPage } from "./components/Eventos/EventoPage";
import { ProgramarEvento } from "./components/Eventos/ProgramarEvento";

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
        <Route path="/logup" element={<Logup />} />
        <Route path="/evento/:id" element={<EventoPage />} />
        <Route path="/programarEvento" element={<ProgramarEvento />} />
      </Routes>
    </Router>
  );
}

export default App;
