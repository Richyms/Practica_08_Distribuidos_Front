import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaStar, FaUserCircle, FaTimesCircle } from "react-icons/fa";
import { userService } from "../services/userService";
import "../styles/NavBarHome.css";

function NavBarHome(){
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await userService.logoutUser();
            navigate("/");
        }
        catch(error) {
            console.log("Error al cerrar sesión: ", error);
        }
    };

    return (
        <nav className="home-navigation">
            <ul className="home-list">
                <li className="home-list-element">
                    <Link 
                        to="/home" 
                        className={`home-link ${location.pathname === "/home" ? "active" : ""}`}
                    >
                        <div className="icon-container">
                            <FaStar className="icon" />
                        </div>
                        <span className="home-link-text">Home</span>
                    </Link>
                </li>
                
                <li className="home-list-element">
                    <Link 
                        to="/profile" 
                        className={`home-link ${location.pathname === "/profile" ? "active" : ""}`}
                    >
                        <div className="icon-container">
                            <FaUserCircle className="icon" />
                        </div>
                        <span className="home-link-text">Perfil</span>
                    </Link>
                </li>
                
                <li className="home-list-element">
                    <button 
                        onClick={handleLogout}
                        className="home-link logout-button"
                    >
                        <div className="icon-container">
                            <FaTimesCircle className="icon" />
                        </div>
                        <span className="home-link-text">Salir</span>
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default NavBarHome;