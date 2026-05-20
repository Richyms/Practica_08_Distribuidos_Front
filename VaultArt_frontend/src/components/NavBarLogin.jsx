import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "../styles/NavBarLogin.css";
//import logo from "../assets/logo.svg";

function NavBarLogin() {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false); 

    const handleLinkClick = () => {
        setMenuOpen(false);
    };

    return(
        <nav className="navigation">
            <div className="logo-container">
                {/* <Link to={"/"}><img src={logo} alt="logo" className="logo"/></Link> */}
            </div>

            <button 
                className={`hamburger ${menuOpen ? 'active' : ''}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menú"
            >
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
            </button>

            {menuOpen && (
                <div 
                    className="menu-overlay"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            <ul className={`list ${menuOpen ? 'active' : ''}`}>
                <li className="list-element">
                    <Link 
                        to="/" 
                        className={`link ${location.pathname === "/" ? "active" : ""}`}
                        onClick={handleLinkClick}
                    >
                        Inicio
                    </Link>
                </li>
                <li className="list-element">
                    <Link 
                        to="/login" 
                        className={`link ${location.pathname === "/login" ? "active" : ""}`}
                        onClick={handleLinkClick}
                    >
                        Iniciar sesión
                    </Link>
                </li>
                <li className="list-element">
                    <Link 
                        to="/register" 
                        className={`link ${location.pathname === "/register" ? "active" : ""}`}
                        onClick={handleLinkClick}
                    >
                        Registrarse
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default NavBarLogin;