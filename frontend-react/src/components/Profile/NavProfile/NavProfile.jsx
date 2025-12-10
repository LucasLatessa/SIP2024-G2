import { NavLink } from "react-router-dom";
import styles from "./NavProfile.module.css";

export default function NavProfile({ usuario, role }) {
  const navItemsByRole = {
    cliente: [
      { label: "Perfil", path: "" },
      { label: "Mis eventos", path: "/mis-eventos" },
      { label: "Cuenta Mercado Pago", path: "/mercado-pago" },
    ],

    productora: [
      { label: "Perfil", path: "" },
      { label: "Mis eventos", path: "/productora-eventos" },
      { label: "Beneficios", path: "/productora-beneficios" },
      { label: "Métricas", path: "/productora-metricas" },
    ],

    administrador: [
      { label: "Perfil", path: "" },
      { label: "Lista usuarios", path: "/admin/usuarios" },
      { label: "Lista eventos", path: "/admin/eventos" },
      { label: "Lista productoras", path: "/admin/productoras" },
    ],
  };

  console.log(role);
  const items = navItemsByRole[role] || [];

  return (
    <section className={styles.navProfile}>
      <h2>Configuración de la cuenta</h2>

      <nav>
        <ul>
          {items.map((item) => (
            <li key={item.path}>
              <NavLink to={`/perfil${item.path}`}
              end={item.path === ""}
              className={({ isActive }) => isActive ? styles.activeLink : ""}>{item.label}</NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
