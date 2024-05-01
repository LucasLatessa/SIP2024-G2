import "../styles/footer.css";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer>
      <nav className="redesSociales">
        <li><Link to="/"><img src="/assets/instagram.png"/></Link></li>
        <li><Link to="/"><img src="/assets/youtube.png"/></Link></li>
        <li><Link to="/"><img src="/assets/x.png"/></Link></li>
        <li><Link to="/"><img src="/assets/facebook.png"/></Link></li>
        
      </nav>
      <small className="copyright">
        <em>Copyright ByPass @2024. Todos los derechos reservados</em>
      </small>
    </footer>
  );
};
