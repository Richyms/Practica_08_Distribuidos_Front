import { FiUser, FiLock, FiMail } from "react-icons/fi";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { userService } from "../services/userService";

import useScrollAnimation from "../hooks/useScrollAnimation";
import NavBarLogin from "../components/NavBarLogin";

import "../styles/Animations.css";
import "../styles/Register.css";

function Register() {
    const {elementRef: section1Ref, isVisible: section1Visible} = useScrollAnimation();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validatePassword = (pass) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return regex.test(pass);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        if(!validatePassword(newPassword) && newPassword.length>0)
            setPasswordError("La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número");
        else
            setPasswordError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!validatePassword(password))
        {
            setPasswordError("La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número");
            return;
        }
        setLoading(true);
        try {
            const userData = {"name": username, "email": email, "password": password};
            await userService.registerUser(userData);
            setUsername("");
            setEmail("");
            setPassword("");
            navigate("/login");
        }
        catch(error) {
            console.log("Error de registro: ", error);
            setPasswordError("Error al registrar usuario");
        }
        finally {
            setLoading(false);
        }
    };

    return(
        <>
            <NavBarLogin />
            <div className="reg-register-container" ref={section1Ref}>
                <div className={`reg-login-column animated-left ${section1Visible ? 'visible': ''}`}>
                    <div className="reg-login-wrapper">
                        <h1 className="reg-login-title">¡Hola!</h1>
                        <p className="reg-login-text">Registre sus datos reales para poder disfrutar de nuestro contenido</p>
                        <Link to="/login"><button className="reg-login-button">Iniciar sesión</button></Link>
                    </div>
                </div>

                <div className={`reg-register-form-column animated-right ${section1Visible ? 'visible' : ''}`}>
                    <div className="reg-register-column-wrapper">
                        <h1 className="reg-register-title">Registrarse</h1>
                        <h3 className="reg-register-subtitle">Use su correo electrónico para registrarse</h3>
                        <form className="reg-register-form" onSubmit={handleSubmit}>
                            <div className="reg-input-group">
                                <FiUser className="reg-input-icon"/>
                                <input type="text" 
                                    placeholder="Nombre de usuario"
                                    value={username}
                                    onChange={handleUsernameChange}
                                    autoComplete="off"
                                    required
                                    className="reg-register-input" />
                            </div>
                            <div className="reg-input-group">
                                <FiMail className="reg-input-icon" />
                                <input type="email" 
                                    placeholder="Correo electrónico"
                                    value={email}
                                    onChange={handleEmailChange}
                                    autoComplete="off"
                                    required
                                    className="reg-register-input" />
                            </div>
                            <div className="reg-input-group">
                                <FiLock className="reg-input-icon" />
                                <input type="password" 
                                    placeholder="Contraseña"
                                    autoComplete="off"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required
                                    className="reg-register-input" />
                                <div className="reg-error-container">
                                    {passwordError && <p className="reg-error-text">{passwordError}</p>}
                                </div>
                            </div>
                            <button className="reg-register-button" type="submit" disabled={loading}>Registrarse</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;