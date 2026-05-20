import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Developers.css';

import profile1 from "../assets/profile1.jpg"
import profile2 from "../assets/profile2.jpg";

function Developers() {
    const navigate = useNavigate();

    const devs = [
        {
            id: 1,
            name: 'Ricardo Mora Santillán',
            role: 'Programador y diseñador',
            description: 'Lo encontrarás despierto con música a altas horas de la noche.',
            photo: profile2
        },
        {
            id: 2,
            name: 'Erick Julián Pérez Ortiz',
            role: 'Director de proyecto y programador',
            description: 'Amante de los gatos.',
            photo: profile1
        }
    ];

    return (
        <div className="developers-section">
            <h2 className="developers-title">Conoce al Equipo</h2>
            <p className="developers-subtitle">Las mentes detrás de VaultArt</p>

            <div className="developers-container">
                {devs.map(dev => (
                    <div key={dev.id} className="developer-card">
                        
                        <div 
                            className="developer-photo-wrapper secret-trigger"
                            onClick={() => navigate('/admin-login')}
                            title="" 
                        >
                            <img src={dev.photo} alt={`Foto de ${dev.name}`} className="developer-photo" />
                        </div>

                        <div className="developer-info">
                            <h3 className="developer-name">{dev.name}</h3>
                            <span className="developer-role">{dev.role}</span>
                            <p className="developer-desc">{dev.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Developers;