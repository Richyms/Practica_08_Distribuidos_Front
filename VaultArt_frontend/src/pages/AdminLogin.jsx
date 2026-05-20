import { Link, useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import { FiLock } from "react-icons/fi";
import { userService } from "../services/userService";
import { useState } from "react";

import useScrollAnimation from "../hooks/useScrollAnimation";
import NavBarLogin from "../components/NavBarLogin";

import "../styles/Login.css";
import "../styles/Animations.css";

function AdminLogin() {
    const { elementRef: section1Ref, isVisible: section1Visible } = useScrollAnimation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setLoading(true);
        try {
            const userData = {"email": email, "password": password};
            await userService.loginUser(userData);
            setEmail("");
            setPassword("");
            navigate("/admin");
        }
        catch(error) {
            console.log("Error de inicio de sesión: ", error);
        }
        finally {
            setLoading(false);
        }
    };

    return(
        <>
            <NavBarLogin />
            <div className="login-container" ref={section1Ref}>
                <div className={`login-form-column animated-left ${section1Visible ? 'visible' : ''}`}>
                    <div className="login-form-wapper">
                        <h1 className="login-title">Iniciar Sesión</h1>
                        <h3 className="login-subtitle">Ingresa tu correo y contraseña</h3>
                        <form className="login-form" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <FiMail className="input-icon" />
                                <input type="email"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={handleEmailChange}
                                autoComplete="off"
                                required
                                className="login-input"/>
                            </div>

                            <div className="input-group">
                                <FiLock className="input-icon" />
                                <input type="password" 
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    autoComplete="off"
                                    required
                                    className="login-input"/>
                            </div>
                            <button className="login-button" type="submit" disabled={loading}>Iniciar sesión</button>
                        </form>
                    </div>
                </div>

                <div className={`welcome-column animated-right ${section1Visible ? 'visible': ''}`}>
                    <div className="welcome-wrapper">
                        <h1 className="welcome-title">¡Bienvenido!</h1>
                        <p className="welcome-text">Es un gusto tenerte de vuelta</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminLogin;