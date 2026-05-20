import React, { useState, useRef, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import '../styles/RatingMenu.css';

function RatingMenu({ movieId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleRating = (rateValue) => {
        setRating(rateValue);
        console.log(`Calificaste con ${rateValue}`);
        setTimeout(() => setIsOpen(false), 400);
    };

    return (
        <div className="rating-menu-wrapper" ref={menuRef}>
            <button 
                className="rating-trigger-btn" 
                onClick={() => setIsOpen(!isOpen)}
            >
                <FaStar /> {rating > 0 ? `Calificada: ${rating}` : 'Calificar'}
            </button>

            {isOpen && (
                <div className="rating-dropdown-card">
                    <p className="rating-question">¿Qué te pareció?</p>
                    <div className="stars-interactive-container">
                        {[...Array(5)].map((star, index) => {
                            const ratingValue = index + 1;
                            return (
                                <label key={index} className="star-label">
                                    <input type="radio" name="rating" value={ratingValue} onClick={() => handleRating(ratingValue)} style={{display: 'none'}} />
                                    <FaStar 
                                        className="interactive-star"
                                        color={ratingValue <= (hover || rating) ? "#ffc107" : "#3a3f58"}
                                        onMouseEnter={() => setHover(ratingValue)}
                                        onMouseLeave={() => setHover(0)}
                                    />
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default RatingMenu;