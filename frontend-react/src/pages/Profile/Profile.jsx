import AccountInfo from "../../components/Profile/Common/AccountInfo"
import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserRole } from "../../utils/useUserRole"
import { useNavigate } from "react-router-dom";
import NavProfile from "../../components/Profile/Common/NavProfile";
import {getUserNick} from "../../services/usuarios.service"

import styles from "./Profile.module.css";

export default function Profile(){
  const { user, logout, isAuthenticated } = useAuth0();
  const role = useUserRole(usuarioData);

  return (
    <main className={styles.profile}>
      <NavProfile user={user} role={role} />
      <AccountInfo user={user} role={role} />
    </main>
  );
}