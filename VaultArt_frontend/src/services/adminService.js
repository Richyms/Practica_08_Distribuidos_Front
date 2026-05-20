import { ecdhService } from "./ecdh_service";
const API_URL = import.meta.env.VITE_API_URL

export const AdminService = 
{
    async getUsers(){
        try {
            const response = await fetch(`${API_URL}/admin/users`,{
                method: "GET",
                credentials: "include", 
            });

            if(!response.ok){
                const errorData = await response.json().catch(() => ({})); 
                throw new Error(errorData.detail || "Error al obtener los usaurios");
            }

            return await response.json();
        }
        catch (error) {
            console.error("Error al obtener los usaurios: ", error);
            throw error;
        }
    },

    async getArtists(){
        try {
            const response = await fetch(`${API_URL}/admin/artists`,{
                method: "GET",
                credentials: "include", 
            });

            if(!response.ok){
                const errorData = await response.json().catch(() => ({})); 
                throw new Error(errorData.detail || "Error al obtener los artistas");
            }

            return await response.json();
        }
        catch(error) {
            console.error("Error al obtener los artistas: ", error);
            throw error;
        }
    },

    async getUserDetails(user_id){
        try {
            const response = await fetch(`${API_URL}/admin/user/${user_id}`,{
                method: "GET",
                credentials: "include", 
            });

            if(!response.ok){
                const errorData = await response.json().catch(() => ({})); 
                throw new Error(errorData.detail || "Error al obtener los detalles del usuario");
            }

            return await response.json();
        }
        catch (error) {
            console.error("Error al obtener el usuario: ", error);
            throw error;
        }
    },

    async changeUserRol(user_id, new_rol){
        try {
            const response = await fetch(`${API_URL}/admin/rol/${user_id}?new_rol=${new_rol}`,{
                method: "POST",
                credentials: "include"});

            if(!response.ok){
                const errorData = await response.json().catch(() => ({})); 
                throw new Error(errorData.detail || "Error al cambiar el rol del usuario");
            }

            return await response.json();
        }
        catch (error) {
            console.error("Error al cambiar el rol del usuario: ", error);
            throw error;
        }
    },

    async deleteUser(user_id){
        try {
            const response = await fetch(`${API_URL}/admin/delete/${user_id}`,{
                method: "POST",
                credentials: "include"
            });

            if(!response.ok){
                const errorData = await response.json().catch(() => ({})); 
                throw new Error(errorData.detail || "Error al eliminar el usuario");
            }

            return await response.json();
        }
        catch (error) {
            console.error("Error al eliminar el usuario: ", error);
            throw error;
        }
    },

    async getFilms(){
        try {
            const response = await fetch(`${API_URL}/admin/films`,{
                method: "GET",
                credentials: "include", 
            });

            if(!response.ok){
                const errorData = await response.json().catch(() => ({})); 
                throw new Error(errorData.detail || "Error al obtener las películas");
            }

            return await response.json();
        }
        catch (error) {
            console.error("Error al obtener las películas: ", error);
            throw error;
        }
    },

    async getFilmDetails(film_id){
        try {
            const response = await fetch(`${API_URL}/admin/film/${film_id}`,{
                method: "GET",
                credentials: "include", 
            });

            if(!response.ok){
                const errorData = await response.json().catch(() => ({})); 
                throw new Error(errorData.detail || "Error al obtener los detalles de la película");
            }

            return await response.json();
        }
        catch (error) {
            console.error("Error al obtener la película: ", error);
            throw error;
        }
    },

    async toggleFilm(film_id){
        try {
            const response = await fetch(`${API_URL}/admin/film/toggle/${film_id}`,{
                method: "POST",
                credentials: "include", 
            });

            if(!response.ok){
                const errorData = await response.json().catch(() => ({})); 
                throw new Error(errorData.detail || "Error al cambiar el estado de la película");
            }

            return await response.json();
        }
        catch (error) {
            console.error("Error al cambiar el estado de la película: ", error);
            throw error;
        }
    },

    async deleteFilm(film_id){
        try {
            const response = await fetch(`${API_URL}/film/delete/${film_id}`,{
                method: "DELETE",
                credentials: "include", 
            });

            if(!response.ok){
                const errorData = await response.json().catch(() => ({})); 
                throw new Error(errorData.detail || "Error al eliminar la película");
            }

            return await response.json();
        }
        catch (error) {
            console.error("Error al eliminar la película: ", error);
            throw error;
        }
    },

    async keyGeneration(user_id){
        try {
            const session = await ecdhService.initSession();

            const response = await fetch(`${API_URL}/admin/key_generation/${user_id}`,{
                method: "POST",
                credentials: "include", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({"public_key_client": session.clientPublicKeyPEM})});

            if(!response.ok){
                const errorData = await response.json().catch(() => ({})); 
                throw new Error(errorData.detail || "Error al generar las llaves");
            }

            const encryptedResponse = await response.json();
            const secret = await ecdhService.deriveSecret(encryptedResponse.public_key_server, 
                                                        session.keyPair.privateKey, 
                                                        ecdhService._base64ToArrayBuffer(encryptedResponse.salt))
            const decryptedData = await ecdhService.decryptData(encryptedResponse.data, secret);

            const content = decryptedData.private_key;
            const blob = new Blob([content], {type: "text/plain"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `key_${user_id}.key`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error("Error al generar las llaves: ", error);
            throw error;
        }
    }
}