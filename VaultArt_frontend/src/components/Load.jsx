import React from 'react';
import "../styles/Load.css";
import work from "../assets/Work.gif";

function Load({ mensaje = "Por favor, espera un momento...", tema = "claro" }){

    const claseTema = tema === "oscuro" ? "load-oscuro" : "load-claro";

    return(
        /* 3. Inyectamos la clase dinámica en el contenedor principal */
        <div className={`load-page ${claseTema}`}>   
            <div className="load-content-wrapper">
                <div className="load-gif-container">
                    <img src={work} alt="Cargando..." className="load-gif" />
                </div>
                
                <h1 className="load-title">Cargando Contenido</h1>
                <p className="load-text">{mensaje}</p>
            </div>
        </div> 
    );
}

export default Load;