import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./components/Home/Home";
import { Profile } from "./components/Profile/profile";
import { Eventos } from "./components/Eventos/Eventos";
import { Marketplace } from "./components/Publicaciones/marketplace";
import { Beneficios } from "./components/Beneficios/Beneficios";
import { EventoPage } from "./components/Eventos/EventoPage";
import { PublicacionPage } from "./components/Publicaciones/PublicacionPage";
import { ProgramarEvento } from "./components/Eventos/ProgramarEvento";
import { Mercadopago } from "./components/Eventos/mercadopago";
import { CrearBeneficio } from "./components/Beneficios/CrearBeneficio";
import { TermsAndConditions } from "./components/RNF/term_cond";
import { Ayuda } from "./components/RNF/ayuda";
import {PublicarTicket} from "./components/Tickets/PublicarTicket";
import { QrScannerComponent  } from "./components/Profile/QrScannerComponent ";
import { ModificarEventos } from "./components/Eventos/ModificarEventos";
import { ReporteEvento } from "./components/Profile/ReporteEvento";
import { ReporteProdu } from "./components/Profile/ReporteProdu";
import { AgregarCuentaMP } from "./components/Profile/AgregarCuentaMP";
import { TransferirTicket} from "./components/Tickets/TransferirTicket";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/terminos_condiciones" element={<TermsAndConditions />} />
        <Route path="/ayuda" element={<Ayuda />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/validarEntrada/:id" element={<QrScannerComponent  />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/reporteEvento/:id" element={<ReporteEvento/>} />
        <Route path="/reporteProdu/:id" element={<ReporteProdu/>} />
        <Route path="/modificarEvento/:id" element={<ModificarEventos />} />
        <Route path="/mercado" element={<Marketplace />} />
        <Route path="/beneficios" element={<Beneficios />} />
        <Route path="/evento/:id" element={<EventoPage />} />
        <Route path="/publicacion/:id" element={<PublicacionPage />} />
        <Route path="/programarEvento" element={<ProgramarEvento />} />
        <Route path="/mercadopago" element={<Mercadopago />} />
        <Route path="/crearBeneficio" element={<CrearBeneficio />} />
        <Route path="/publicar-ticket" element={<PublicarTicket />} />
        <Route path="/transferirTicket" element={<TransferirTicket />} />
        <Route path="/agregarCuentaMP" element={<AgregarCuentaMP/>} />
      </Routes>
    </Router>
  );
}

export default App;
