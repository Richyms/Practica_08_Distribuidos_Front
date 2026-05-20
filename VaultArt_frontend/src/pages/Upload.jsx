import React from 'react';
import { FaPlus, FaTimes, FaImage, FaFilm, FaKey, FaArrowLeft } from 'react-icons/fa';
import { useUpload } from '../hooks/useUpload'; 
import { Link } from 'react-router-dom';
import '../styles/Upload.css';

function Upload() {
    const {
        formData, artists, currentArtist, setCurrentArtist,
        contentFile, posterFile, keyFile,
        handleChange, addArtist, removeArtist,
        handleContentChange, handlePosterChange, handleKeyChange,
        handleSubmit
    } = useUpload();

    return (
        <div className="upload-page-wrapper">
            <div className="upload-form-container">
                
                {/* Botón de regreso */}
                <Link to="/admin" className="back-arrow-admin">
                    <FaArrowLeft /> Regresar al Panel
                </Link>

                {/* Encabezado limpio y único */}
                <div className="upload-header">
                    <h1 className="upload-title">Formulario de Contenido</h1>
                    <p className="upload-subtitle">Sube el archivo, el póster y tu llave privada</p>
                </div>

                <form onSubmit={handleSubmit} className="upload-form">
                    
                    {/* Título */}
                    <div className="input-group">
                        <input type="text" name="title" placeholder="Título de la película o serie" value={formData.title} onChange={handleChange} required />
                    </div>

                    {/* Fila 1: Director y Género */}
                    <div className="input-row">
                        <div className="input-group half-width">
                            <input type="text" name="director" placeholder="Director" value={formData.director} onChange={handleChange} />
                        </div>
                        <div className="input-group half-width">
                            <select name="genre" value={formData.genre} onChange={handleChange} required>
                                <option value="" disabled>Género...</option>
                                <option value="Accion">Acción</option>
                                <option value="Ciencia Ficcion">Ciencia Ficción</option>
                                <option value="Drama">Drama</option>
                                <option value="Comedia">Comedia</option>
                                <option value="Terror">Terror</option>
                            </select>
                        </div>
                    </div>

                    {/* Fila 2: Año y Categoría */}
                    <div className="input-row align-center">
                        <div className="input-group half-width">
                            <input type="number" name="year" placeholder="Año de lanzamiento (Ej. 2024)" value={formData.year} onChange={handleChange} />
                        </div>
                        <div className="radio-group half-width">
                            <label className="radio-label">
                                <input type="radio" name="category" value="Película" checked={formData.category === 'Película'} onChange={handleChange} /> Película
                            </label>
                            <label className="radio-label">
                                <input type="radio" name="category" value="Serie" checked={formData.category === 'Serie'} onChange={handleChange} /> Serie
                            </label>
                        </div>
                    </div>

                    {/* Artistas */}
                    <div className="input-group">
                        <div className="artist-input-wrapper">
                            <input type="text" placeholder="Agregar artista / actor..." value={currentArtist} onChange={(e) => setCurrentArtist(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addArtist(e)} />
                            <button type="button" className="add-artist-btn" onClick={addArtist}><FaPlus /></button>
                        </div>
                        {artists.length > 0 && (
                            <div className="artists-chip-container">
                                {artists.map((artist, index) => (
                                    <span key={index} className="artist-chip">
                                        {artist} <FaTimes className="remove-artist-icon" onClick={() => removeArtist(artist)} />
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sinopsis */}
                    <div className="input-group">
                        <textarea name="synopsis" placeholder="Sinopsis de la película..." rows="3" value={formData.synopsis} onChange={handleChange} required></textarea>
                    </div>

                    {/* ZONA DE SUBIDA DE ARCHIVOS */}
                    
                    {/* 1. Archivo de Póster */}
                    <div className="input-group">
                        <label className="custom-file-upload">
                            <input type="file" accept="image/*" onChange={handlePosterChange} required />
                            <span className="file-name-display">{posterFile ? posterFile.name : "Seleccionar póster oficial (Imagen)..."}</span>
                            <div className="icon-wrapper">
                                <FaImage className="upload-icon" />
                            </div>
                        </label>
                    </div>

                    {/* 2. Archivo de Llave Privada */}
                    <div className="input-group">
                        <label className="custom-file-upload">
                            <input type="file" accept='.key' onChange={handleKeyChange} required />
                            <span className="file-name-display">{keyFile ? keyFile.name : "Cargar archivo de Llave Privada (.key)..."}</span>
                            <div className="icon-wrapper">
                                <FaKey className="upload-icon" />
                            </div>
                        </label>
                    </div>

                    {/* 3. Archivo de Video */}
                    <div className="input-group">
                        <label className="custom-file-upload">
                            <input type="file" accept="video/*" onChange={handleContentChange} required />
                            <span className="file-name-display">{contentFile ? contentFile.name : "Seleccionar video (.mp4, .mkv)..."}</span>
                            <div className="icon-wrapper">
                                <FaFilm className="upload-icon" />
                            </div>
                        </label>
                    </div>

                    {/* Botón Guardar */}
                    <button type="submit" className="submit-content-btn">
                        Almacenar Contenido
                    </button>

                </form>
            </div>
        </div>
    );
}

export default Upload;