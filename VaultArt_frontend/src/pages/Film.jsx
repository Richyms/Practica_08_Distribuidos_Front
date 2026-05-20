import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaPlay, FaBackward, FaForward } from 'react-icons/fa';
import { contentService } from '../services/contentService';
import Error from "../components/Error";
import Load from "../components/Load";
import '../styles/Film.css';

function Film() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [poster, setPoster] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null); 
    const [video, setVideo] = useState(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const cargarDatosReproductor = async () => {
            try {
                setLoading(true);
                setErrorMsg(null);
                const datos = await contentService.getMovieById(id);
                setMovie(datos);

                const imagenBlob = await contentService.getPoster(id);
                setPoster(imagenBlob);

                const streamUrl = await contentService.getStream(id);
                setVideo(streamUrl);
            } catch (error) {
                console.error("Error al cargar la información para el reproductor:", error);
                if (error.response && error.response.status === 404) {
                    setErrorMsg("La película o serie que buscas no existe o fue eliminada.");
                } else {
                    setErrorMsg("No pudimos cargar la información del contenido en este momento.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            cargarDatosReproductor();
        } else {
            console.error("Error crítico: No hay ID en la URL.");
            setErrorMsg("URL inválida.");
            setLoading(false);
        }

        return () => {
            if (poster && poster.startsWith("blob:")) {
                URL.revokeObjectURL(poster);
            }
        };
    }, [id]);

    if (loading) return <Load mensaje="Preparando el reproductor..." tema="oscuro" />;
    
    if (errorMsg) {
        return <Error mensaje={errorMsg} />;
    }

    if (!movie) {
        return <Error mensaje="La película o serie que buscas no existe o fue eliminada." />;
    }

    return (
        <div className="film-page">
            <div className="film-header">
                <Link to={`/content/${id}`} className="film-back-btn">
                    <FaArrowLeft />
                </Link>
            </div>

            {/* ZONA DEL REPRODUCTOR DE VIDEO */}
            <div className="player-wrapper">
                {video ? (
                    <video 
                        ref={videoRef}
                        className='real-video'
                        controls
                        autoPlay
                        src={video}
                        onError={() => setErrorMsg("Error al cargar el video")}></video>
                ) : (
                    <div className="video-placeholder">
                        <p className="waiting-backend">Esperando video cifrado del servidor...</p>
                        <div className="mock-controls">
                            <FaBackward className="control-icon" />
                            <FaPlay className="control-icon play-icon" />
                            <FaForward className="control-icon" />
                        </div>
                    </div>
                )}
            </div>

            <div className="film-info-section">
                <h1 className="film-title-display">{movie.title}</h1>
                
                <div className="film-meta-container">
                    <div className="film-thumbnail-box">
                        <img src={poster || "https://via.placeholder.com/80"} alt={movie.title} className="film-thumbnail" />
                    </div>
                    
                    <div className="film-text-details">
                        <p className="film-artists-text">
                            {movie.director || "Director"} • {movie.company || "Productora"}
                        </p>
                        <p className="film-desc-text">
                            {movie.description || "Sin descripción disponible."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Film;