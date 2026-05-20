import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlay, FaHeart, FaArrowLeft, FaCheck } from 'react-icons/fa';
import NavBarHome from '../components/NavBarHome';
import { contentService } from '../services/contentService';
import RecommendationList from '../components/RecommendationList';
import Error from "../components/Error";
import Load from '../components/Load';
import Rating from '../components/RatingMenu';
import '../styles/Content.css';

function Content() {
    const { id } = useParams(); 
    
    const [movie, setMovie] = useState(null);
    const [poster, setPoster] = useState(null);
    const [recomendaciones, setRecomendaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    const [inMyList, setInMyList] = useState(false); 

    useEffect(() => {
        const DataMovie = async () => {
            try {
                setLoading(true);
                setErrorMsg(null);
                
                const datos = await contentService.getMovieById(id);
                setMovie(datos);

                const imagenBlob = await contentService.getPoster(id);
                setPoster(imagenBlob);

                const catalogoCompleto = await contentService.getMovieContent(); 
                
                const filtradas = catalogoCompleto.filter(
                    peli => peli.genre === datos.genre && peli._id !== id
                );
                
                setRecomendaciones(filtradas.slice(0, 5));

            } catch (error) {
                console.error("¡ERROR DETECTADO! Detalle:", error);
                
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
            DataMovie();
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

    const toggleMyList = () => {
        setInMyList(!inMyList);
        // Aquí podrías hacer la petición al backend para guardarlo en la base de datos
        // ej: contentService.addToMyList(id);
    };

    if (loading) {
        return <Load mensaje="Cargando detalles..." />;
    }
    
    if (errorMsg) {
        return <Error mensaje={errorMsg} />;
    }

    if (!movie) {
        return <Error mensaje="La película o serie que buscas no existe o fue eliminada." />;
    }

    return (
        <>
            <NavBarHome />
            <div className="main-content detail-container">
                <Link to="/home" className="back-link">
                    <FaArrowLeft /> Volver
                </Link>

                <div className="content-banner">
                    <img 
                        src={poster || "https://via.placeholder.com/150"} 
                        alt={movie.title || "Sin título"} 
                        className="content-banner-img" 
                    />
                    <div className="content-overlay">
                        <h1 className="content-title">{movie.title || "Título no disponible"}</h1>
                        <p className="content-metadata">
                            {movie.director || "Director"} • {movie.company || "Productora"} • {movie.release_year || "Año"}
                        </p>
                        <p className="content-description">
                            {movie.synopsis || "Sin descripción disponible para este título."}
                        </p>
                    </div>
                </div>

                <div className="content-actions">
                    <Link to={`/film/${id}`} className="play-link">
                        <button className="play-button">
                            <FaPlay /> Reproducir
                        </button>
                    </Link>
                    
                    <button className="action-icon-btn" onClick={toggleMyList} style={{ color: inMyList ? '#00e676' : 'inherit' }}>
                        {inMyList ? <><FaCheck /> En mi lista</> : <><FaHeart /> Mi Lista</>}
                    </button>

                    <Rating movieId={id} />
                </div>
                {movie && <RecommendationList peliculasSugeridas={recomendaciones} />}
            </div>
        </>
    );
}

export default Content;