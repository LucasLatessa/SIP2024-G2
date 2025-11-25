import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Events from "../pages/Events/Events";
import Login from "../pages/Login/Login";

export default function AppRouter(){
      return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}