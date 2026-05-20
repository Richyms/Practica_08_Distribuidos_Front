import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminService } from '../services/adminService';
import { FaUpload, FaKey, FaTrash, FaBan, FaUserEdit, FaEye } from 'react-icons/fa';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

import '../styles/Admin.css';

function Admin() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [users, setUsers] = useState([]);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if(activeTab === 'users')
            loadUsers();
        else if(activeTab === 'movies')
            loadMovies();
    }, [activeTab]);

    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await AdminService.getUsers();
            setUsers(data);
        } catch(error) {
            setError(error.message);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const loadMovies = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await AdminService.getFilms();
            setMovies(data);
        } catch(error) {
            setError(error.message);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRolChange = async (userId, currentRol) => {
        const newRol = currentRol === 'user' ? 'artist': 'user';
        if (window.confirm(`¿Cambiar el rol de usuario a ${newRol}`)) {
            try {
                await AdminService.changeUserRol(userId, newRol);
                await loadUsers();
            } catch(error) {
                alert("No se logró cambiar el rol del usuario");
            }
        }
    };

    const handleDeleteUser = async (userId) => {
        if(window.confirm(`¿Eliminar al usuario permanentemente?`)) {
            try {
                await AdminService.deleteUser(userId);
                await loadUsers();
            } catch(error) {
                alert("No se logró eliminar el usuario");
            }
        }
    };

    const handleToggleFilm = async (filmId) => {
        try {
            await AdminService.toggleFilm(filmId);
            await loadMovies();
        } catch(error) {
            alert("No se logró cambiar el estado de la película");
        }
    };

    const handleDeleteFilm = async (filmId) => {
        if(window.confirm(`¿Eliminar la película permanentemente?`)) {
            try {
                await AdminService.deleteFilm(filmId);
                await loadMovies();
            } catch(error) {
                alert("No se logró eliminar la película");
            }
        }
    };

    return (
        <div className="admin-layout">
            
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="admin-content">
                
                {/* Componente: Cabecera con título dinámico y perfil de usuario */}
                <AdminHeader titulo="Panel de Administración" />

                {/* --- VISTA: RESUMEN (DASHBOARD) --- */}
                {activeTab === 'dashboard' && (
                    <div className="dashboard-view">
                        <div className="dashboard-cards">
                            <div className="dash-card gradient-purple">
                                <div className="card-info">
                                    <h3>Subir Nuevo Contenido</h3>
                                    <p>Sube videos cifrados al catálogo</p>
                                    <Link to="/upload" className="card-action">Ir al formulario</Link>
                                </div>
                                <FaUpload className="card-icon" />
                            </div>

                            <div className="dash-card gradient-blue">
                                <div className="card-info">
                                    <h3>Generador de Llaves</h3>
                                    <p>Crea pares de llaves criptográficas</p>
                                    <Link to="/key-generator" className="card-action">Generar ahora</Link>
                                </div>
                                <FaKey className="card-icon" />
                            </div>
                        </div>

                        <div className="dashboard-split">
                            <div className="mini-panel">
                                <div className="panel-header">
                                    <h3>Últimos Usuarios</h3>
                                    <button className="text-btn" onClick={() => setActiveTab('users')}>Ver todos</button>
                                </div>
                                <div className="mini-list">
                                    {users.slice(0, 3).map(u => (
                                        <div key={u._id} className="list-item">
                                            <div className="item-info">
                                                <strong>{u.name}</strong>
                                                <span>{u.rol}</span>
                                            </div>
                                            <button className="icon-action"><FaEye /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mini-panel">
                                <div className="panel-header">
                                    <h3>Últimas Películas</h3>
                                    <button className="text-btn" onClick={() => setActiveTab('movies')}>Ver todas</button>
                                </div>
                                <div className="mini-list">
                                    {movies.slice(0, 3).map(m => (
                                        <div key={m._id} className="list-item">
                                            <div className="item-info">
                                                <strong>{m.title}</strong>
                                                <span className={`status-badge ${m.is_active === true ? 'active' : 'inactive'}`}>
                                                    {`${m.is_active === true ? 'active' : 'inactive'}`}
                                                </span>
                                            </div>
                                            <button className="icon-action"><FaEye /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- VISTA: TODOS LOS USUARIOS --- */}
                {activeTab === 'users' && (
                    <div className="full-panel">
                        <h2>Gestión de Usuarios</h2>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id}>
                                        <td>{user._id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td><span className="role-badge">{user.rol}</span></td>
                                        <td className="actions-cell">
                                            <button className="action-btn edit" title="Cambiar Rol"
                                                onClick={() => handleRolChange(user._id, user.rol)}><FaUserEdit /></button>
                                            <button className="action-btn delete" title="Eliminar"
                                                onClick={() => handleDeleteUser(user._id)}><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* --- VISTA: TODAS LAS PELÍCULAS --- */}
                {activeTab === 'movies' && (
                    <div className="full-panel">
                        <h2>Catálogo de Películas</h2>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Título</th>
                                    <th>Género</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movies.map(movie => (
                                    <tr key={movie._id}>
                                        <td>{movie._id}</td>
                                        <td>{movie.title}</td>
                                        <td>{movie.genre}</td>
                                        <td>
                                            <span className={`status-badge ${movie.is_active === true ? 'active' : 'inactive'}`}>
                                                {`${movie.is_active === true ? 'active' : 'inactive'}`}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            <button className="action-btn warn" 
                                                title={`${movie.is_active === true ? 'Desactivar' : 'Activar'}`}
                                                onClick={() => handleToggleFilm(movie._id)}><FaBan /></button>
                                            <button className="action-btn delete" title="Eliminar"
                                                onClick={() => handleDeleteFilm(movie._id)}><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </main>
        </div>
    );
}

export default Admin;