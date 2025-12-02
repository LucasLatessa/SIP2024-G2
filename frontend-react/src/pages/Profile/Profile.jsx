import { useAuth0 } from "@auth0/auth0-react";

export const Profile = () => {

  const { logout } = useAuth0();


  return (
    <>
      <div>Profile</div>
      <button
        className="logout"
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      >
        Log out
      </button>
    </>
  );
}