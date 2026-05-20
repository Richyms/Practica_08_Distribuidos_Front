import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
// Importamos el nuevo ícono FaSignOutAlt para la puerta de salida
import { FaHome, FaUsers, FaFilm, FaKey, FaUpload, FaSignOutAlt } from 'react-icons/fa';

function AdminSidebar({ activeTab, setActiveTab }) {
    const location = useLocation();
    const navigate = useNavigate();

    // Decide si cambiar la pestaña local o redirigir al panel principal
    const handleMenuClick = (tabName) => {
        if (location.pathname !== '/admin') {
            navigate('/admin');
        } else if (setActiveTab) {
            setActiveTab(tabName);
        }
    };

    // Lógica para Cerrar Sesión
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
        <aside className="admin-sidebar">
            <div className="sidebar-brand">
                <h2>VaultArt <span>Admin</span></h2>
            </div>
            
            <nav className="sidebar-nav">
                <p className="nav-label">MENU PRINCIPAL</p>
                <button 
                    className={`nav-btn ${activeTab === 'dashboard' && location.pathname === '/admin' ? 'active' : ''}`} 
                    onClick={() => handleMenuClick('dashboard')}
                >
                    <FaHome /> Resumen
                </button>
                <button 
                    className={`nav-btn ${activeTab === 'users' && location.pathname === '/admin' ? 'active' : ''}`} 
                    onClick={() => handleMenuClick('users')}
                >
                    <FaUsers /> Usuarios
                </button>
                <button 
                    className={`nav-btn ${activeTab === 'movies' && location.pathname === '/admin' ? 'active' : ''}`} 
                    onClick={() => handleMenuClick('movies')}
                >
                    <FaFilm /> Películas
                </button>

                <p className="nav-label">HERRAMIENTAS</p>
                <Link to="/upload" className={`nav-btn link-btn ${location.pathname === '/upload' ? 'active' : ''}`}>
                    <FaUpload /> Subir Contenido
                </Link>
                <Link to="/key-generator" className={`nav-btn link-btn ${location.pathname === '/key-generator' ? 'active' : ''}`}>
                    <FaKey /> Generar Llaves
                </Link>
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #2a2d3d' }}>
                <button 
                    className="nav-btn" 
                    onClick={handleLogout}
                    style={{ color: '#ff4d4d', width: '100%' }}
                >
                    <FaSignOutAlt /> Cerrar Sesión
                </button>
            </div>

        </aside>
    );
}

export default AdminSidebar;