import { useState, useEffect } from "react";
import NavBarHome from "../components/NavBarHome";
import { userService } from '../services/userService';
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUser, FaEdit, FaCreditCard, FaCalendarAlt, FaSave } from "react-icons/fa";
import Error from "../components/Error";
import Load from "../components/Load";
import "../styles/Profile.css";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const data = await userService.dataUser();
                setUser(data);
                setEditedName(data?.name || "");
                console.log("Datos del usuario:", data); 
            } catch (err) {
                setError(err.message);
                console.error("No se pudo recuperar el perfil:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        // BACKEND: Aquí llamarías a tu servicio para guardar el nuevo nombre en la base de datos
        // Ejemplo: await userService.updateUserName(editedName);
        
        console.log("Guardando nuevo nombre en el servidor:", editedName);

        setUser({ ...user, name: editedName });
        setIsEditing(false);
    };

    if (loading) return <Load mensaje="Cargando tu perfil..." />;
    if (error) return <Error mensaje={error} />;
    
    const userData = {
        metodoPago: "**** **** **** 1234",
    };

    return (
        <>
            <NavBarHome />
            <div className="main-profile">
                <div className="profile-header">
                    <Link to="/home" className="back-arrow">
                        <FaArrowLeft />
                    </Link>
                    <h1 className="profile-title">Perfil</h1>
                </div>

                <div className="profile-container">
                    <div className="profile-picture-section">
                        <div className="avatar-circle">
                            <FaUser />
                        </div>
                    </div>

                    <div className="profile-info-section">
                        
                        {/* Campo de Nombre (Dinámico) */}
                        <div className="info-group">
                            <label>Nombre</label>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    className="info-box edit-input" 
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    autoFocus
                                />
                            ) : (
                                <div className="info-box">{user?.name || "No disponible"}</div>
                            )}
                        </div>

                        <div className="info-group">
                            <label>Email</label>
                            <div className="info-box">{user?.email || "No disponible"}</div>
                        </div>
                        <div className="info-group">
                            <label>Método de Pago</label>
                            <div className="info-box">{userData.metodoPago}</div>
                        </div>
                        
                        <div className="info-group">
                            <label>Suscrito desde</label>
                            <div className="info-box">
                                <FaCalendarAlt style={{marginRight: '10px', color: '#674FA3'}} /> 
                                {user?.subscription_start_date || "No disponible"}
                            </div>
                            <label>Fecha de finalización</label>
                            <div className="info-box">
                                <FaCalendarAlt style={{marginRight: '10px', color: '#674FA3'}} /> 
                                {user?.subscription_end_date || "No disponible"}
                            </div>
                        </div>
                    </div>

                    {/* Botones Dinámicos */}
                    <div className="profile-actions">
                        {isEditing ? (
                            <button className="btn-profile edit-btn" onClick={handleSaveClick} style={{ backgroundColor: '#00e676', borderColor: '#00e676', color: '#1a1a2e' }}>
                                <FaSave /> Guardar
                            </button>
                        ) : (
                            <>
                                <button className="btn-profile edit-btn" onClick={handleEditClick}>
                                    <FaEdit /> Editar
                                </button>
                                <button 
                                    className="btn-profile payment-btn" 
                                    onClick={() => navigate('/payment')}
                                >
                                    <FaCreditCard /> Modificar método de pago
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;