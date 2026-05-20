import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/MovieGrid.css';

import { homeService } from '../services/homeService';

function MovieGrid({ filtro, peliculas }) {
    if (!peliculas || peliculas.length === 0) return <p>No hay contenido disponible.</p>;

    const contenido = peliculas.filter(item => {
        if (filtro === "Todos") return true;
        if (filtro === "Peliculas") return item.type === "Movie";
        if (filtro === "Series") return item.type === "Serie";
        return item.genre === filtro;
    });

    if (filtro === "Todos") {
        const generosUnicos = [...new Set(peliculas.map(p => p.genre))];
        return (
            <div className="movie-grid-container">
                {generosUnicos.map(gen => (
                    <div key={gen} className="category-section">
                        <h2 className="grid-title">{gen}</h2>
                        <div className="grid-layout">
                            {peliculas.filter(p => p.genre === gen).map(p => <MovieCard key={p.id} item={p} />)}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="movie-grid-container">
            <h2 className="grid-title">{filtro}</h2>
            <div className="grid-layout">
                {contenido.map(p => <MovieCard key={p.id} item={p} />)}
            </div>
        </div>
    );
}

function MovieCard({ item }) {
    const [poster, setPoster] = useState("https://via.placeholder.com/150");
    useEffect(() => {
        const cargarPoster = async () => {
            if(item._id) {
                try {
                    const imagen = await homeService.getPoster(item._id);
                    setPoster(imagen);
                } catch(error) {
                    console.log("Ocurrio un error al cargar el poster. ", error);
                }
            }    
        };
        cargarPoster();

        return () => {
            if(poster && poster.startsWith("blob:")){
                URL.revokeObjectURL(poster);
            }
        };
    }, [item._id]);
    return (
        <Link to={`/content/${item._id}`} className="movie-card-link">
            <div className="movie-card">
                <div className="card-image-wrapper">
                    <img src={poster} alt={item.title} className="card-img" />
                </div>
                <p className="card-title">{item.title}</p>
            </div>
        </Link>
    );
}

export default MovieGrid;