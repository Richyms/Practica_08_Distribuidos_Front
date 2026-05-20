import useScrollAnimation from "../hooks/useScrollAnimation";
import NavBarLogin from "../components/NavBarLogin";
import Carousel from "../components/Carousel";
import Developers from '../components/Developers';

import "../styles/Index.css";
import "../styles/Animations.css";

function Index() {
    const { elementRef: section1Ref, isVisible: section1Visible } = useScrollAnimation();
    const { elementRef: section2Ref, isVisible: section2Visible } = useScrollAnimation();
    const { elementRef: section3Ref, isVisible: section3Visible } = useScrollAnimation();

    return(
        <>
            <NavBarLogin />
            <Carousel />

            {/* PRIMERA SECCIÓN */}
            <div className="about-project" ref={section1Ref}>
                <div className={`description-column animated-left ${section1Visible ? 'visible' : ''}`}>
                    <div className="description-wrapper">
                        <p className="description-text">Es una plataforma que explora los servicios de streaming y la criptografía, a través de 
                            este proyecto se verá la funcionalidad de los contratos digitales, la confidencialidad, autenticidad e integridad 
                            de los archivos y manteniendo las obras de artistas locales en un entorno seguro.
                        </p>
                    </div>
                </div>

                <div className={`what-is-column animated-right ${section1Visible ? 'visible' : ''}`}>
                    <div className="info-wrapper">
                        <h1 className="info-title">¿Qué es Vault Art?</h1>
                        <h3 className="info-subtitle">Un servicio de streaming seguro</h3>
                    </div>
                </div>
            </div>

            {/* SEGUNDA SECCIÓN */}
            <div className="about-project" ref={section2Ref}>
                <div className={`title-column animated-left ${section2Visible ? 'visible' : ''}`}>
                    <div className="title-column-wrapper">
                        <h1 className="title-column-title">Características</h1>
                        <h3 className="title-column-subtitle">¿Qué ofrecemos?</h3>
                    </div>
                </div>

                <div className={`info-column animated-right ${section2Visible ? 'visible' : ''}`}>
                    <div className="info-column-wrapper">
                        <ul>
                            <li className="description-text">Contratos digitales: Los acuerdos se firman de forma digital.</li>
                            <li className="description-text">Seguridad de obras: Las creaciones se encuentran protegidas de terceros.</li>
                            <li className="description-text">Integridad: Cualquier cambio no autorizado será identificado en segundos.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* TERCERA SECCIÓN */}
            <div className="about-project" ref={section3Ref}>
                <div className={`description-column animated-left ${section3Visible ? 'visible' : ''}`}>
                    <div className="description-wrapper">
                        <ul>
                            <li className="description-text">Crea tu cuenta y elige alguno de nuestros planes.</li>
                            <li className="description-text">Explora nuestro catálogo, tendrás una amplia variedad de contenido.</li>
                            <li className="description-text">Firma contratos digitales como artista, comienza tu carrera de artista.</li>
                        </ul>
                    </div>
                </div>

                <div className={`title-column animated-right ${section3Visible ? 'visible' : ''}`}>
                    <div className="title-column-wrapper">
                        <h1 className="info-title">¿Cómo funciona?</h1>
                        <h3 className="info-subtitle">Como disfrutar de nuestra plataforma</h3>
                    </div>
                </div>
            </div>

            <div className="developers-wrapper">
                <Developers />
            </div>

        </>
    );
}

export default Index;