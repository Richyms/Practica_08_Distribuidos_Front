const API_URL = import.meta.env.VITE_API_URL

export const contentService =
{
    async getMovieById(idPelicula){
        try{
            const response = await fetch(`${API_URL}/film/${idPelicula}`,{
                method: "GET",
                credentials: "include", 
            });

            if(!response.ok){
                const errorData = await response.json().catch(() => ({})); 
                throw new Error(errorData.detail || "Error al obtener la pelicula");
            }

            return await response.json();

        }
        catch (error) {
            console.error("Error en getMovieById:", error);
            throw error;
        }
    },

    async getPoster(idPelicula){
        try{
            const response = await fetch(`${API_URL}/film/poster/${idPelicula}`,{
                method: "GET",
                credentials: "include", 
            });

            if(!response.ok){
                const errorData = await response.json().catch(() => ({})); 
                throw new Error(errorData.detail || "Error al obtener los posters");
            }

            const imageBlob = await response.blob();
            return URL.createObjectURL(imageBlob);

        }
        catch (error) {
            console.error("Error en getPoster:", error);
            throw error;
        }
    },

    async getMovieContent(){
        try{
            const response = await fetch(`${API_URL}/film`,{
                method: "GET",
                credentials: "include", 
                headers: {
                    "Accept": "application/json"
                }
            });

            if(!response.ok){
                const errorData = await response.json().catch(() => ({})); 
                throw new Error(errorData.detail || "Error al obtener las peliculas");
            }

            return await response.json();

        }
        catch (error) {
            console.error("Error en getMovieHome:", error);
            throw error;
        }
    },

    async getStream(id) {
        try {
            const url = `${API_URL}/film/stream/${id}`;
                const testResponse = await fetch(url, {
                method: "GET",
                credentials: "include"
            });
            
            if (!testResponse.ok) {
                throw new Error("No se puede acceder al stream");
            }
            
            return url;
        }
        catch (error) {
            console.error("Error al reproducir la película:", error);
            throw error;
        }
    },

    async getTypeFilm(type_film)
    {
        try {
            const response = await fetch(`${API_URL}/film/type?type_film=${type_film}`,{
                method: "GET",
                credentials: "include"
            });

            if(!response.ok){
                const errorData = await response.json().catch(() => ({})); 
                throw new Error(errorData.detail || "Error al obtener las peliculas");
            }

            return await response.json();
        }
        catch (error) {
            console.error("Error al obtener el tipo seleccionado:", error);
            throw error;
        }
    }
}