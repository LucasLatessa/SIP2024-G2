import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "../pages/Home/Home";
import Events from "../pages/Events/Events";
import Login from "../pages/Login/Login";
import EventDetail from "../pages/EventDetail/EventDetail";

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
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
