import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Header } from "./header-footer/header";
import { Footer } from "./header-footer/footer";

export const Home = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="App">
      <Header />
      {isAuthenticated && (
        <>
          Usted se logeo correctamente (para ver su perfil haga click arriba a
          la derecha)
        </>
      )}
      <Footer />
    </div>
  );
};
