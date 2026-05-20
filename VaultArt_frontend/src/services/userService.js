import { ecdhService } from "./ecdh_service";
const API_URL = import.meta.env.VITE_API_URL

export const userService =
{
    async registerUser(userData)
    {
        try
        {
            const session = await ecdhService.initSession();
            const encryptedData = await ecdhService.encryptData(userData, session.sharedSecret);
            const data = {public_key_client: session.clientPublicKeyPEM, data: encryptedData, salt: session.salt};
            const response = await fetch(`${API_URL}/user/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)});
            if(!response.ok)
            {
                const error = await response.json();
                throw new Error(error.detail || "Error al registrar el usuario");
            }
            return await response.json();
        }
        catch(error)
        {
            console.log(error);
            throw error;
        }
    },
    async loginUser(userData)
    {
        try
        {
            const session = await ecdhService.initSession();
            const encryptedData = await ecdhService.encryptData(userData, session.sharedSecret);
            const data = {public_key_client: session.clientPublicKeyPEM, data: encryptedData, salt: session.salt};
            const response = await fetch(`${API_URL}/user/login`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)});
            if(!response.ok)
            {
                const error = await response.json();
                throw new Error(error.detail || "Error al iniciar sesión");
            }
            return await response.json();
        }
        catch(error)
        {
            console.log(error);
            throw error;
        }
    },
    async logoutUser()
    {
        try
        {
            const response = await fetch(`${API_URL}/user/logout`, 
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            if(!response.ok)
            {
                const error = await response.json();
                throw new Error(error.detail || "Error al cerrar sesión");
            }
            return await response.json();
        }
        catch(error)
        {
            console.log(error);
            throw error;
        }
    },

    async dataUser() {
        try {
            const response = await fetch(`${API_URL}/user/profile`, 
                {
                    method: "GET",
                    credentials: "include"
                });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || "Error al obtener los datos");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en dataUser:", error);
            throw error;
        }
    }
}