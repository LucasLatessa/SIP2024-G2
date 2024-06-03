import "./styles/footer.css";
import { Link } from "react-router-dom";

//Footer del sitio
export const Footer = () => {
  return (
    <footer>
      <nav className="redesSociales">
      <li>
        <Link to="/">
          <img src="/assets/instagram.png" alt="Instagram Logo" />
        </Link>
      </li>
      <li>
        <Link to="/">
          <img src="/assets/youtube.png" alt="Youtube Logo"/>
        </Link>
      </li>
      <li>
        <Link to="/"><img src="/assets/x.png" alt="X Logo"/>
        </Link>
      </li>
      <li>
        <Link to="/"><img src="/assets/facebook.png"alt="Facebook Logo"/>
        </Link>
      </li>
      <li>
        <Link className="link-ayuda" to="/ayuda"><a>Obtener ayuda</a>
        </Link>
      </li>
        
      </nav>
      <small className="copyright">
        <em>Copyright ByPass @2024. Todos los derechos reservados</em>
      </small>
    </footer>
  );
};
