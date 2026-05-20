import React from 'react';

function AdminHeader({ titulo }) {
    // En un futuro, estos datos podrían venir de tu contexto de autenticación o estado global
    const userName = "Ricardo"; 
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <header className="content-header">
            <h1>{titulo}</h1>
            <div className="admin-profile">
                <div className="avatar">{userInitial}</div>
                <span>Hola, {userName}</span>
            </div>
        </header>
    );
}

export default AdminHeader;