import "./styles/productoraView.css";
import { UserList } from "./UserList";
import { EventsList } from "./EventsList";
import { ProductorasList } from "./ProductorasList";

//Vista de productora
export const AdministradorView = ({ rol, id }) => {

  //Solo si es producotra se muestra este componente
  if (rol === "ADMINISTRADOR") {
    return (
        <> 
        <UserList />
        <EventsList  />
        <ProductorasList />
        </>
    );
  }
};
