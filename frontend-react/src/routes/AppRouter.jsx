import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "../pages/Home/Home";
import Events from "../pages/Events/Events";
import EventDetail from "../pages/EventDetail/EventDetail";
import NotFound from "../pages/NotFound/NotFound";

// Layouts
import { Header } from "../components/layout/Header/Header";
import { Footer } from "../components/layout/Footer/Footer";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eventos" element={<Events />} />
        <Route path="/eventos/:id" element={<EventDetail />} />

        {/* ← Ruta 404 al final */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
