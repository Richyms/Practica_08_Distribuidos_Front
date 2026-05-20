import { Link, useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import { FiLock } from "react-icons/fi";
import { userService } from "../services/userService";
import { useState } from "react";

import useScrollAnimation from "../hooks/useScrollAnimation";
import NavBarLogin from "../components/NavBarLogin";

import "../styles/Login.css";
import "../styles/Animations.css";

function Login() {
    const { elementRef: section1Ref, isVisible: section1Visible } = useScrollAnimation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setLoginError(null);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setLoginError(null);
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setLoading(true);
        setLoginError(null);
        try {
            const userData = {"email": email, "password": password};
            await userService.loginUser(userData);
            setEmail("");
            setPassword("");
            navigate("/home");
        }
        catch(error) {
            console.log("Error de inicio de sesión: ", error);
            setLoginError("Correo o contraseña incorrectos. Por favor, verifica tus datos.");
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
                        <h3 className="login-subtitle">Usa correo y contraseña</h3>
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

                            <div className="forgot-password">
                                <Link className="forgot-link">¿Olvidaste la contraseña?</Link>
                            </div>

                            {loginError && (
                                <div className="login-error-message">
                                    {loginError}
                                </div>
                            )}

                            <button className="login-button" type="submit" disabled={loading}>Iniciar sesión</button>
                        </form>
                    </div>
                </div>

                <div className={`welcome-column animated-right ${section1Visible ? 'visible': ''}`}>
                    <div className="welcome-wrapper">
                        <h1 className="welcome-title">¡Bienvenido!</h1>
                        <p className="welcome-text">Ingrese sus datos personales para acceder al contenido disponible</p>
                        <Link to="/register"><button className="register-button" type="submit">Registrarse</button></Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;