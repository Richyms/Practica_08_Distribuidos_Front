import { useState, useEffect } from "react";
import NavBarHome from "../components/NavBarHome";
import MovieGrid from "../components/MovieGrid";
import { Link } from "react-router-dom";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import { homeService } from '../services/homeService';

import Load from "../components/Load";
import ErrorHome from "../components/ErrorHome";

import "../styles/Home.css";
import film1 from "../assets/film1.jpg";
import { contentService } from "../services/contentService";

function Home() {

    const [isOpen, setIsOpen] = useState(false);
    const [filtro, setFiltro] = useState("Todos");

    const [generos, setGeneros] = useState([]);

    // 🔥 CATÁLOGO ORIGINAL COMPLETO
    const [allPeliculas, setAllPeliculas] = useState([]);

    // 🔥 CATÁLOGO MOSTRADO
    const [peliculas, setPeliculas] = useState([]);

    const [loading, setLoading] = useState(true);
    const [errorData, setErrorData] = useState(null);

    const [bestMovie, setBestMovie] = useState(null);
    const [bestPoster, setBestPoster] = useState(film1);
    const [synopsis, setSypnopsis] = useState(null);

    // ==========================================
    // CARGA INICIAL
    // ==========================================
    useEffect(() => {

        const cargarPagina = async () => {

            try {

                setLoading(true);
                setErrorData(null);

                const [dataGeneros, dataPeliculas] = await Promise.all([
                    homeService.getGenres(),
                    homeService.getMovieHome()
                ]);

                setGeneros(
                    dataGeneros.map((g, i) => ({
                        id: i,
                        nombre: g
                    }))
                );

                // 🔥 GUARDAMOS EL CATÁLOGO ORIGINAL
                setAllPeliculas(dataPeliculas);

                // 🔥 MOSTRAMOS EL CATÁLOGO
                setPeliculas(dataPeliculas);

                if (dataPeliculas.length > 0) {
                    setBestMovie(dataPeliculas[0]);
                }

            } catch (error) {

                console.error("Error cargando Home:", error);

                if (error.status === 401 || error.status === 403) {

                    setErrorData({
                        titulo: "¡Acceso Restringido!",
                        mensaje: "Tu sesión ha expirado o necesitas iniciar sesión para ver el catálogo.",
                        textoBoton: "Ir al inicio de sesión",
                        rutaBoton: "/"
                    });

                } else {

                    setErrorData({
                        titulo: "¡Error de Conexión!",
                        mensaje: "No pudimos cargar el catálogo en este momento.",
                        textoBoton: "Reintentar",
                        rutaBoton: "/home"
                    });

                }

            } finally {
                setLoading(false);
            }

        };

        cargarPagina();

    }, []);

    // ==========================================
    // CARGA DE POSTER Y SINOPSIS
    // ==========================================
    useEffect(() => {

        const cargarPosterDestacado = async () => {

            if (bestMovie && bestMovie._id) {

                try {

                    const imagen = await homeService.getPoster(bestMovie._id);
                    setBestPoster(imagen);

                } catch (error) {
                    console.error("Error al cargar poster destacado:", error);
                }

            }

        };

        const descripcionDestacada = async () => {

            if (bestMovie && bestMovie._id) {

                try {

                    const syn = await homeService.getMovieById(bestMovie._id);
                    setSypnopsis(syn.synopsis);

                } catch (error) {
                    console.error("Error al cargar la sinopsis:", error);
                }

            }

        };

        cargarPosterDestacado();
        descripcionDestacada();

    }, [bestMovie]);

    // ==========================================
    // CAMBIAR FILTRO NORMAL
    // ==========================================
    const cambiarFiltro = (f) => {

        setFiltro(f);
        setIsOpen(false);

        // 🔥 SI VUELVE A TODOS
        if (f === "Todos") {

            setPeliculas(allPeliculas);

            if (allPeliculas.length > 0) {
                setBestMovie(allPeliculas[0]);
            }

        }

    };

    // ==========================================
    // CARGAR POR TIPO
    // ==========================================
    const cargarPorTipo = async (tipo) => {

        try {

            setLoading(true);
            setFiltro(tipo);

            const tipo_final =
                tipo === "Peliculas"
                    ? "Película"
                    : "Serie";

            const data = await contentService.getTypeFilm(tipo_final);

            setPeliculas(data);

            if (data.length > 0) {
                setBestMovie(data[0]);
            }

        } catch (error) {

            console.error(`Error cargando ${tipo}:`, error);

        } finally {

            setLoading(false);

        }

    };

    // ==========================================
    // LOADING
    // ==========================================
    if (loading) {
        return <Load mensaje="Cargando el catálogo de VaultArt..." tema="claro" />;
    }

    // ==========================================
    // ERROR
    // ==========================================
    if (errorData) {

        return (
            <ErrorHome
                titulo={errorData.titulo}
                mensaje={errorData.mensaje}
                textoBoton={errorData.textoBoton}
                rutaBoton={errorData.rutaBoton}
            />
        );

    }

    // ==========================================
    // RENDER
    // ==========================================
    return (

        <>
            <NavBarHome />

            <div className="main-content">

                {/* SEARCHBAR */}
                <div className="searchbar-container">

                    <div className="searchbar">

                        <input
                            type="text"
                            className="inputSearch"
                            placeholder="Buscar..."
                        />

                        <button className="buttonsearch">
                            <FaSearch />
                        </button>

                    </div>

                </div>

                {/* BEST MOVIE */}
                <div className="bestcontent">

                    {bestMovie ? (

                        <Link
                            to={`/content/${bestMovie._id}`}
                            className="bestcontent-link"
                        >

                            <img
                                src={bestPoster}
                                alt={bestMovie.title}
                                className="bestcontent-img"
                                style={{
                                    objectFit: 'cover',
                                    objectPosition: 'center 20%'
                                }}
                            />

                            <div className="bestcontent-text-overlay">

                                <h1 className="bestcontent-title">
                                    {bestMovie.title}
                                </h1>

                                <p className="bestcontent-subtitle">
                                    {bestMovie.directors?.join(', ') || bestMovie.director}
                                    {" | "}
                                    {bestMovie.company || "Productora"}
                                    {" | "}
                                    {bestMovie.release_year}
                                </p>

                                <p className="bestcontent-description">
                                    {synopsis || "Sin descripción disponible."}
                                </p>

                            </div>

                        </Link>

                    ) : (

                        <div className="bestcontent-placeholder">
                            No hay contenido destacado disponible.
                        </div>

                    )}

                </div>

                {/* FILTROS */}
                <div className="buttonbar">

                    <div className="dropdown-container">

                        <button
                            className="dropdown-button"
                            onClick={() => setIsOpen(!isOpen)}
                            disabled={loading}
                        >

                            {
                                filtro === "Todos" ||
                                filtro === "Peliculas" ||
                                filtro === "Series"
                                    ? "Categoria"
                                    : filtro
                            }

                            <FaChevronDown
                                className={`dropdown-icon ${isOpen ? 'open' : ''}`}
                            />

                        </button>

                        {isOpen && (

                            <div className="dropdown-menu">

                                <button
                                    className="dropdown-item"
                                    onClick={() => cambiarFiltro("Todos")}
                                >
                                    Todos
                                </button>

                                {generos.map(g => (

                                    <button
                                        key={g.id}
                                        className="dropdown-item"
                                        onClick={() => cambiarFiltro(g.nombre)}
                                    >
                                        {g.nombre}
                                    </button>

                                ))}

                            </div>

                        )}

                    </div>

                    <button
                        className={`normal-button ${filtro === "Series" ? "active-btn" : ""}`}
                        onClick={() => cargarPorTipo("Series")}
                    >
                        Series
                    </button>

                    <button
                        className={`normal-button ${filtro === "Peliculas" ? "active-btn" : ""}`}
                        onClick={() => cargarPorTipo("Peliculas")}
                    >
                        Peliculas
                    </button>

                </div>

                {/* GRID */}
                <div className="content">

                    <MovieGrid
                        filtro={
                            filtro === "Series" || filtro === "Peliculas"
                                ? "Todos"
                                : filtro
                        }
                        peliculas={peliculas}
                    />

                </div>

            </div>
        </>

    );

}

export default Home;