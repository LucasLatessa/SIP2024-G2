import styles from "./AccountInfo.module.css";

export default function AccountInfo ({ user, role }){
  // return (
  //   <section className="account-info">
  //     <div className="account-card">
  //       <img
  //         src={user.picture}
  //         alt="profile"
  //         className="account-avatar"
  //       />

  //       <div className="account-data">
  //         <h2 className="account-name">{user.name}</h2>
  //         <p className="account-email">{user.email}</p>
  //         <span className="account-role">
  //           {role === "customer" && "Cliente"}
  //           {role === "producer" && "Productora"}
  //           {role === "admin" && "Administrador"}
  //         </span>
  //       </div>
  //     </div>
  //   </section>
  // );

  console.log(user);

  return(
    <section className={styles.accountInfo}>
      <h1> Informacion de cuenta </h1>
      <hr />
      <article className={styles.userAccountInfo}>
        <h3>{user.nombre}</h3>
        <p></p>
        <img src="" alt="" />
      </article>
      
    </section>
  );
}