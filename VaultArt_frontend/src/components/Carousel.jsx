import { useState, useEffect } from "react";
import "../styles/Carousel.css";

import film1 from "../assets/film1.jpg";
import film2 from "../assets/film2.jpg";
import film3 from "../assets/film3.jpg";

function Carousel() 
{
    const [currentSlide, setCurrentSlide] = useState(0);
    const images = [film1, film2, film3
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev+1)%images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [images.length]);

    return(
        <div className="carrusel-container">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`carrusel-slide ${index === currentSlide ? 'active': ""}`}
                    style={{backgroundImage: `url(${image})`}} />
            ))}

            <div className="carrusel-overlay">
                {/* <img src={logoIPN} alt="Logo IPN" className="carrusel-logo" /> */}
                <h1 className="carrusel-text">VAULT ART</h1>
                <p className="carrusel-subtext">BIENVENIDO</p>
            </div>

            <div className="carrusel-indicators">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`indicator ${index === currentSlide ? "active" : ""}`}
                        onClick={() => setCurrentSlide(index)} />
                ))}
            </div>
        </div>
    );
}

export default Carousel;