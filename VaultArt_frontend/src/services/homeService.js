const API_URL = import.meta.env.VITE_API_URL

export const homeService = {
    async getGenres() {
        try {
            const response = await fetch(`${API_URL}/film/genre`, {
                method: "GET",
                credentials: "include", 
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const error = new Error(errorData.detail || "Error al obtener los géneros");
                error.status = response.status; 
                throw error;
            }

            return await response.json();
        } 
        catch (error) {
            console.error("Error en getGenres:", error);
            throw error;
        }
    },

    async getMovieHome() {
        try {
            const response = await fetch(`${API_URL}/film`, {
                method: "GET",
                credentials: "include", 
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({})); 
                const error = new Error(errorData.detail || "Error al obtener las peliculas");
                error.status = response.status;
                throw error;
            }

            return await response.json();

        }
        catch (error) {
            console.error("Error en getMovieHome:", error);
            throw error;
        }
    },

    async getPoster(idPelicula) {
        try {
            const response = await fetch(`${API_URL}/film/poster/${idPelicula}`, {
                method: "GET",
                credentials: "include", 
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({})); 
                const error = new Error(errorData.detail || "Error al obtener los posters");
                error.status = response.status; // <-- Clave añadida
                throw error;
            }

            const imageBlob = await response.blob();
            return URL.createObjectURL(imageBlob);

        }
        catch (error) {
            console.error("Error en getPoster:", error);
            throw error;
        }
    },

    async getMovieById(idPelicula) {
        try {
            const response = await fetch(`${API_URL}/film/${idPelicula}`, {
                method: "GET",
                credentials: "include", 
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({})); 
                const error = new Error(errorData.detail || "Error al obtener la pelicula");
                error.status = response.status; // <-- Clave añadida
                throw error;
            }

            return await response.json();

        }
        catch (error) {
            console.error("Error en getMovieById:", error);
            throw error;
        }
    }
}