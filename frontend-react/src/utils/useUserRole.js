import { useEffect, useState } from "react";

export function useUserRole(user) {
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (!user) return;

    // 1. Intentar leer desde metadata personalizada
    const metadataRole =
      user["https://tuevento.com/role"] ||
      user["https://tuevento.com/roles"]?.[0];

    if (metadataRole) {
      setRole(metadataRole);
      return;
    }

    // 2. Si no existe metadata, intentar logicamente inferir el role
    if (user.email?.includes("@admin")) {
      setRole("admin");
    } else if (user.email?.includes("@productora")) {
      setRole("producer");
    } else {
      setRole("customer");
    }
  }, [user]);

  return role;
}