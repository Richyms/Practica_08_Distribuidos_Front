import React from 'react';
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import errorgif from "../assets/Error.gif";
import "../styles/Error.css";

function Error({ mensaje = "Ha ocurrido un error inesperado al procesar tu solicitud." }) {

    return(

        <div className="error-page">   
            
            <div className="error-header">
                <Link to="/home" className="back-arrow">
                    <FaArrowLeft /> Volver al catálogo
                </Link>
            </div> 

            <div className="error-content-wrapper">
                <div className="error-gif-container">
                    <img src={errorgif} alt="Error" className="error-gif" />
                </div>
                
                <h1 className="error-title">¡Ups! Algo salió mal.</h1>
                
                <p className="error-text">{mensaje}</p>

                <Link to="/home" className="error-home-btn">
                    Regresar al inicio
                </Link>
            </div>

        </div> 
    );
}

export default Error;