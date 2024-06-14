import React, { useState, useEffect } from "react";
import { Header } from "../header-footer/header";
import { Footer } from "../header-footer/footer";
import { useAuth0 } from "@auth0/auth0-react";
import { updateClienteMP } from "../../services/usuarios.service";

export const AgregarCuentaMP = () => {
    const { user,getAccessTokenSilently } = useAuth0();
    const [token, setToken] = useState();
    const [editingUserData, setEditingUserData] = useState(null);

    useEffect(() => {      
        async function obtenerToken() {
          const token = await getAccessTokenSilently();
          setToken(token);
        }

        obtenerToken();
      }, [getAccessTokenSilently]);

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingUserData({ ...editingUserData, [name]: value });
      };
      const handleButton = async () => {
        const json_data = {
            public_key : editingUserData['public_key'],
            access_token : editingUserData['access_token'],
            user_nn : user.nickname,
        };
        console.log(json_data)
        const response = await updateClienteMP(json_data);
      }

    return(
        <main>
            <Header />
                <div className="datosMP">
                    <label>
                    public_key:
                    <input
                        type="text"
                        name="public_key"
                        onChange={handleInputChange}
                    />
                    </label>
                    <label>
                    access_token:
                    <input
                        type="text"
                        name="access_token"
                        onChange={handleInputChange}
                    />
                    </label>
                </div>
                <div className="botonAgregarMP">
                    <button className="Agregar Cuenta" onClick={handleButton}>
                        Agregar Cuenta 
                    </button>
                </div>
            <Footer />
        </main>
    );


    
}