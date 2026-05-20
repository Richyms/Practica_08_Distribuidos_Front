import { SiGmail } from "react-icons/si";

import "../styles/Footer.css";

function Footer() {
    const handleGmailClick = () => {
        const email = "vaultart804@gmail.com";
        const subject = "Consultas y sugerencias - Vault Art";
        const body = `Me comunico con ustedes para: 
[Escribir aquí su consulta o sugerencia]

Quedo antento(a) a su respuesta.
Saludos cordiales.`;

        const urlGmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(urlGmail, "_blank");
    };

    return(
        <footer className="footer-container">
            <p className="footer-text">Contáctanos en:</p>
            <div className="footer-links">
                <button className="footer-link"
                    onClick={handleGmailClick}
                    title="Enviar correo electrónico"><SiGmail /></button>
            </div>
        </footer>
    );
}

export default Footer;