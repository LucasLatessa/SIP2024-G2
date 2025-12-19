import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "../pages/Home/Home";
import Events from "../pages/Events/Events";
import EventDetail from "../pages/EventDetail/EventDetail";
import NotFound from "../pages/NotFound/NotFound";

// Layouts
import { Header } from "../components/layout/Header/Header";
import { Footer } from "../components/layout/Footer/Footer";
import { Mercado } from "../pages/Mercado/Mercado";
import Beneficios from "../pages/Beneficios/Beneficios";

/* Perfil */
import ProfileLayout from "../pages/Profile/ProfileLayout";
import AccountInfo from "../components/Profile/Common/AccountInfo/AccountInfo";

/* Perfil cliente */
import CliEventos from "../pages/Profile/Cliente/CliEventos/CliEventos";
import CliMercadoPago from "../pages/Profile/Cliente/CliMercadoPago/CliMercadoPago";

/* Perfil Productora */
import ProductBeneficios from "../pages/Profile/Productora/ProductBeneficios/ProductBeneficios";
import ProductEventos from "../pages/Profile/Productora/ProductEventos/ProductEventos";
import ProductMetricas from "../pages/Profile/Productora/ProductMetricas/ProductMetricas";

/* Perfil Productora */
import AdmEventos from "../pages/Profile/Administrador/AdmEventos/AdmEventos";
import AdmProductoras from "../pages/Profile/Administrador/AdmProductoras/AdmProductoras";
import AdmUsuarios from "../pages/Profile/Administrador/AdmUsuarios/AdmUsuarios";
import { Toaster } from "react-hot-toast";
import CrearEvento from "../pages/Profile/Productora/CrearEvento/CrearEvento";
import CrearBeneficio from "../pages/Profile/Productora/CrearBeneficio/CrearBeneficio";
import MercadoDetail from "../pages/MercadoDetail/MercadoDetail";
import ValidarEntrada from "../pages/Profile/Productora/ValidarEntrada/ValidarEntrada";
import ReporteEvento from "../pages/Reportes/ReporteEvento/ReporteEvento";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eventos" element={<Events />} />
        <Route path="/eventos/:id" element={<EventDetail />} />
        <Route path="/crear-evento" element={<CrearEvento />} />
        <Route path="/mercado" element={<Mercado />} />
        <Route path="/mercado/:id" element={<MercadoDetail />} />
        <Route path="/beneficios" element={<Beneficios />} />
        <Route path="/crear-beneficio" element={<CrearBeneficio />} />

        {/* Perfil */}
        <Route path="/perfil" element={<ProfileLayout />}>
          <Route path="/perfil" element={<AccountInfo />} />

          {/* Perfil Cliente*/}
          <Route path="/perfil/mis-eventos" element={<CliEventos />} />
          <Route path="/perfil/mercado-pago" element={<CliMercadoPago />} />

          {/* Perfil Productora*/}
          <Route
            path="/perfil/productora-eventos"
            element={<ProductEventos />}
          />
          <Route
            path="/perfil/productora-eventos/validar/:id"
            element={<ValidarEntrada />}
          />
          <Route
            path="/perfil/productora-eventos/reporte/:id"
            element={<ReporteEvento />}
          />
          
          <Route
            path="/perfil/productora-beneficios"
            element={<ProductBeneficios />}
          />
          <Route
            path="/perfil/productora-metricas"
            element={<ProductMetricas />}
          />

          {/* Perfil Admin*/}
          <Route path="/perfil/admin/eventos" element={<AdmEventos />} />
          <Route path="/perfil/admin/usuarios" element={<AdmUsuarios />} />
          <Route
            path="/perfil/admin/productoras"
            element={<AdmProductoras />}
          />
        </Route>

        {/* ← Ruta 404 al final */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Notificaciones */}
      <Toaster
        toastOptions={{
          style: {
            fontFamily: "Poppins",
          },
        }}
      />

      <Footer />
    </BrowserRouter>
  );
}
