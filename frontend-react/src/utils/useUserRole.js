import { useEffect, useState } from "react";

export function useUserRole(usuarioData) {
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (!usuarioData) return;

    if (usuarioData.rol) {
      setRole(usuarioData.rol.toLowerCase());
      return;
    }

    setRole(null); // Sin rol definido
  }, [usuarioData]);

  return role;
}