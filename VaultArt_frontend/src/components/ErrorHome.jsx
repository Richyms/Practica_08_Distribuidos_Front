import React from 'react';
import { Link } from "react-router-dom";
import errorgif from "../assets/errorinicio.gif"; 
import "../styles/Error.css"; 

function ErrorHome({ 
    titulo = "¡Acceso Restringido!", 
    mensaje = "Tu sesión ha expirado o necesitas iniciar sesión para ver esto.",
    textoBoton = "Ir al inicio de sesión",
    rutaBoton = "/"
}) {

    return(
        <div className="error-page">   
            <div className="error-content-wrapper">
                <div className="error-gif-container">
                    <img src={errorgif} alt="Error Crítico" className="error-gif" />
                </div>
                
                <h1 className="error-title">{titulo}</h1>
                
                <p className="error-text">{mensaje}</p>

                <Link to={rutaBoton} className="error-home-btn">
                    {textoBoton}
                </Link>
            </div>
        </div> 
    );
}

export default ErrorHome;