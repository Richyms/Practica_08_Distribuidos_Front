import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaLock, FaCalendarAlt, FaUser } from 'react-icons/fa';
import '../styles/Payment.css';

function Payment() {
    const navigate = useNavigate();
    const [paymentData, setPaymentData] = useState({
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentData({ ...paymentData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Procesando pago con datos:", paymentData);
        //Lógica del backend para pasarela de pagos
        alert("¡Pago exitoso! Bienvenido a VaultArt Premium");
        navigate('/home');
    };

    return (
        <div className="payment-wrapper">
            
            <div className="bg-shape shape-1"></div>
            <div className="bg-shape shape-2"></div>
            <div className="bg-shape shape-3"></div>

            <div className="payment-glass-card">
                
                {/* Resumen del Plan */}
                <div className="payment-header">
                    <h2 className="payment-title">VaultArt Premium</h2>
                    <p className="payment-subtitle">Desbloquea el catálogo completo</p>
                    <div className="price-badge">
                        <span className="currency">$</span>
                        <span className="amount">149</span>
                        <span className="period">/mes</span>
                    </div>
                </div>
                
                {/* Formulario de Tarjeta */}
                <form onSubmit={handleSubmit} className="payment-form">
                    
                    <div className="input-group-pill">
                        <FaUser className="input-icon" />
                        <input 
                            type="text" 
                            name="cardName" 
                            placeholder="Nombre del Titular" 
                            className="pill-input"
                            value={paymentData.cardName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group-pill">
                        <FaCreditCard className="input-icon" />
                        <input 
                            type="text" 
                            name="cardNumber" 
                            placeholder="Número de Tarjeta (0000 0000 0000 0000)" 
                            maxLength="16"
                            className="pill-input"
                            value={paymentData.cardNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Fila dividida para Fecha y CVV */}
                    <div className="input-row">
                        <div className="input-group-pill half-width">
                            <FaCalendarAlt className="input-icon" />
                            <input 
                                type="text" 
                                name="expiry" 
                                placeholder="MM/AA" 
                                maxLength="5"
                                className="pill-input"
                                value={paymentData.expiry}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group-pill half-width">
                            <FaLock className="input-icon" />
                            <input 
                                type="password" 
                                name="cvv" 
                                placeholder="CVV" 
                                maxLength="4"
                                className="pill-input"
                                value={paymentData.cvv}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="payment-submit-btn">
                        <FaLock style={{ marginRight: '8px' }} /> PAGAR DE FORMA SEGURA
                    </button>
                    
                    <p className="secure-notice">
                        Tus datos bancarios están cifrados de extremo a extremo.
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Payment;