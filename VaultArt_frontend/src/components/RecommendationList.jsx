import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaStar } from 'react-icons/fa';
import { contentService } from '../services/contentService'; 
import '../styles/RecommendationList.css';

function RecommendationList({ peliculasSugeridas }) {
    if (!peliculasSugeridas || peliculasSugeridas.length === 0) {
        return <p className="no-recs-msg">No hay recomendaciones similares por el momento.</p>;
    }

    return (
        <div className="recommendation-wrapper">
            <h2 className="recommendation-header">Recomendaciones</h2>
            <div className="recommendation-list">
                {peliculasSugeridas.map(item => (
                    <RecommendationItem key={item._id || item.id} item={item} />
                ))}
            </div>
        </div>
    );
}

function RecommendationItem({ item }) {
    const [poster, setPoster] = useState("https://via.placeholder.com/80");

    useEffect(() => {
        const cargarPoster = async () => {
            const id = item._id || item.id;
            if (id) {
                try {
                    const imagen = await contentService.getPoster(id);
                    setPoster(imagen);
                } catch (error) {
                    console.log("Error al cargar mini poster:", error);
                }
            }
        };
        cargarPoster();

        return () => {
            if (poster && poster.startsWith("blob:")) {
                URL.revokeObjectURL(poster);
            }
        };
    }, [item._id, item.id]);

    return (
        <Link to={`/content/${item._id || item.id}`} className="rec-item-link">
            <div className="rec-item">
                <div className="rec-thumbnail-wrapper">
                    <img src={poster} alt={item.title} className="rec-thumbnail" />
                </div>
                <div className="rec-info">
                    <h3 className="rec-title">{item.title}</h3>
                    <p className="rec-meta">{item.director || "Artistas destacados"}</p>
                    <p className="rec-category">{item.genre || "Categorías"}</p>
                </div>
                <div className="rec-actions">
                    <div className="rec-stars">
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                    </div>
                    <button className="rec-heart-btn" onClick={(e) => e.preventDefault()}>
                        <FaHeart />
                    </button>
                </div>
            </div>
        </Link>
    );
}

export default RecommendationList;