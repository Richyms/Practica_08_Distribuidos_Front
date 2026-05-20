import React, { useState, useEffect } from 'react';
import { AdminService } from '../services/adminService';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import { FaKey, FaSpinner, FaUserCheck, FaCheckCircle } from 'react-icons/fa';
import '../styles/Admin.css'; 

function KeyGenerator() {
    // ==========================================
    // 1. ESTADOS DEL COMPONENTE
    // ==========================================
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [completed, setCompleted] = useState(false);

    // ==========================================
    // 2. EFECTO: CARGAR USUARIOS AL INICIAR
    // ==========================================
    useEffect(() => {
        const cargarUsuarios = async () => {
            const users = await AdminService.getArtists();
            setUsuarios(users);
        };
        cargarUsuarios();
    }, []);

    // ==========================================
    // 3. MANEJADORES DE EVENTOS
    // ==========================================
    
    const seleccionarUsuario = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setCompleted(false);
    };

    const generarLlave = async () => {
        if (!usuarioSeleccionado) return;
        
        setIsGenerating(true);
        setCompleted(false);

        try {
            await AdminService.keyGeneration(usuarioSeleccionado._id);
            setCompleted(true);
        } catch (error) {
            console.error("Error en la generación:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />

            <main className="admin-content">
                <AdminHeader titulo="Generador de Llaves Criptográficas" />
                
                <div className="dashboard-split" style={{ alignItems: 'flex-start' }}>
                    
                    {/* TABLA */}
                    <div className="full-panel" style={{ flex: 2 }}>
                        <h2>Usuarios Elegibles</h2>
                        <p style={{ color: '#888', marginBottom: '20px' }}>
                            Selecciona un Administrador o Artista para generar sus credenciales de cifrado.
                        </p>
                        
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Rol</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(user => (
                                    <tr 
                                        key={user._id} 
                                        style={{ 
                                            cursor: 'pointer', 
                                            backgroundColor: usuarioSeleccionado?._id === user._id ? 'rgba(106, 75, 147, 0.2)' : 'transparent',
                                            transition: 'background 0.3s'
                                        }}
                                        onClick={() => seleccionarUsuario(user)}
                                    >
                                        <td>#{user._id}</td>
                                        <td>
                                            <strong>{user.name}</strong><br/>
                                            <small style={{color: '#6c7293'}}>{user.email}</small>
                                        </td>
                                        <td><span className="role-badge">{user.rol}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PANEL DERECHO */}
                    <div className="dash-card gradient-purple" style={{ flex: 1, flexDirection: 'column', textAlign: 'center', padding: '40px 20px' }}>
                        
                        {/* SIN SELECCIÓN */}
                        {!usuarioSeleccionado && (
                            <>
                                <FaUserCheck className="card-icon" style={{ fontSize: '4rem', marginBottom: '20px' }} />
                                <h3 style={{color: 'white'}}>Esperando selección</h3>
                                <p style={{color: 'rgba(255,255,255,0.8)'}}>
                                    Haz clic en un usuario.
                                </p>
                            </>
                        )}

                        {/* GENERANDO */}
                        {usuarioSeleccionado && isGenerating && (
                            <>
                                <FaSpinner className="card-icon" style={{ fontSize: '4rem', marginBottom: '20px', animation: 'spin 1s linear infinite' }} />
                                <h3 style={{color: 'white'}}>Procesando...</h3>
                                <p style={{color: 'rgba(255,255,255,0.8)'}}>
                                    Generando llaves criptográficas...
                                </p>
                            </>
                        )}

                        {/* LISTO PARA GENERAR */}
                        {usuarioSeleccionado && !isGenerating && !completed && (
                            <>
                                <FaKey className="card-icon" style={{ fontSize: '4rem', marginBottom: '20px' }} />
                                <h3 style={{color: 'white'}}>Generar Llave</h3>
                                <p style={{color: 'rgba(255,255,255,0.8)', marginBottom: '25px'}}>
                                    Para: <strong>{usuarioSeleccionado.name}</strong>
                                </p>
                                <button 
                                    onClick={generarLlave}
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px 25px',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Iniciar Proceso
                                </button>
                            </>
                        )}

                        {/* COMPLETADO */}
                        {completed && (
                            <>
                                <FaCheckCircle style={{ fontSize: '4rem', marginBottom: '20px', color: '#00e676' }} />
                                <h3 style={{color: 'white'}}>¡Completado!</h3>
                                <p style={{color: 'rgba(255,255,255,0.8)'}}>
                                    La llave fue generada y descargada automáticamente.
                                </p>
                            </>
                        )}
                    </div>

                </div>
            </main>
            
            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

export default KeyGenerator;