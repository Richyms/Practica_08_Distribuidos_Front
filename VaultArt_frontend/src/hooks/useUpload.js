import { useState } from 'react';
import { ecdhService } from '../services/ecdh_service';
import { redirect } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL

export const useUpload = () => {
    // 1. Estados de texto
    const [formData, setFormData] = useState({
        title: '',
        director: '',
        genre: '',
        year: '',
        synopsis: '',
        category: 'Pelicula'
    });

    const [artists, setArtists] = useState([]);
    const [currentArtist, setCurrentArtist] = useState('');

    // 2. Estados para los ARCHIVOS
    const [contentFile, setContentFile] = useState(null);
    const [posterFile, setPosterFile] = useState(null);
    const [keyFile, setKeyFile] = useState(null);

    // 3. Manejadores
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const addArtist = (e) => {
        e.preventDefault();
        if (currentArtist.trim() !== '' && !artists.includes(currentArtist.trim())) {
            setArtists([...artists, currentArtist.trim()]);
            setCurrentArtist(''); 
        }
    };

    const removeArtist = (artistToRemove) => {
        setArtists(artists.filter(artist => artist !== artistToRemove));
    };

    // Manejadores independientes para cada tipo de archivo
    const handleContentChange = (e) => {
        if (e.target.files && e.target.files.length > 0) setContentFile(e.target.files[0]);
    };
    
    const handlePosterChange = (e) => {
        if (e.target.files && e.target.files.length > 0) setPosterFile(e.target.files[0]);
    };

    const handleKeyChange = (e) => {
        if (e.target.files && e.target.files.length > 0) setKeyFile(e.target.files[0]);
    };

    // 4. Envío
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const readKeyFile = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target.result);
                reader.onerror = (error) => reject(error);
                reader.readAsText(file);
            });
        };

        try {
            let privateKey = null;
            if(keyFile)
                privateKey = await readKeyFile(keyFile);
            const session = await ecdhService.initSession();
            const encryptedData = await ecdhService.encryptData({"private_key": privateKey}, session.sharedSecret);
            const data = {public_key_client: session.clientPublicKeyPEM, data: encryptedData, salt: session.salt};

            const formDataToSend = new FormData();
            formDataToSend.append("data_client", JSON.stringify(data));
            formDataToSend.append("title", formData.title);
            formDataToSend.append("director", formData.director);
            artists.forEach(artist => {formDataToSend.append("artists", artist)});
            formDataToSend.append("synopsis", formData.synopsis);
            formDataToSend.append("genre", formData.genre);
            formDataToSend.append("type", formData.category);
            formDataToSend.append("release_year", parseInt(formData.year));
            formDataToSend.append("video", contentFile);
            formDataToSend.append("poster", posterFile);

            const response = await fetch(`${API_URL}/film/upload`, {
                method: "POST", credentials: "include", body: formDataToSend});
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({})); 
                throw new Error(errorData.detail || "Error al subir la pelicula");
            }

            setFormData({
                title: '',
                director: '',
                genre: '',
                year: '',
                synopsis: '',
                category: 'Pelicula'
            });
            setArtists([]);
            setContentFile(null);
            setPosterFile(null);
            setKeyFile(null);
        }
        catch (error) {
            console.error("Error al subir la película: ", error);
            throw error;
        }
    };

    return {
        formData, artists, currentArtist, setCurrentArtist,
        contentFile, posterFile, keyFile,
        handleChange, addArtist, removeArtist,
        handleContentChange, handlePosterChange, handleKeyChange,
        handleSubmit
    };
};