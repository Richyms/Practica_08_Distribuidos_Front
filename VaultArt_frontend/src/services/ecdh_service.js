const API_URL = import.meta.env.VITE_API_URL

export const ecdhService = {
    _serverPublicKey: null,
    _keyPair: null,

    async getServerPublicKey() {
        try {
            if (this._serverPublicKey)
                return this._serverPublicKey;

            const response = await fetch(`${API_URL}/ecdh/public_key`, {
                method: "GET",
                credentials: "include", 
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const error = new Error(errorData.detail || "Error al obtener la llave");
                error.status = response.status; 
                throw error;
            }

            const data = await response.json();
            this._serverPublicKey = data.public_key;
            return this._serverPublicKey;
        }
        catch (error) {
            console.error("Error al obtener la lalve pública del servidor: ", error);
            throw error;
        }
    },

    async generateKeyPair() {
        try {
            const keyPair = await window.crypto.subtle.generateKey({name: "ECDH", namedCurve: "P-384"},
                true, ["deriveBits"]);
            this._keyPair = keyPair;
            return keyPair;
        }
        catch(error) {
            console.error("Error al generar el par de llaves: ", error);
            throw error;
        }
    },

    async exportPublicKeyPEM(publicKey) {
        try {
            const exported = await window.crypto.subtle.exportKey("spki", publicKey);
            const base64 = this._arrayBufferToBase64(exported);
            return `-----BEGIN PUBLIC KEY-----\n${base64.match(/.{1,64}/g).join('\n')}\n-----END PUBLIC KEY-----`
        }
        catch(error) {
            console.error("Error al exportar la llave: ", error);
            throw error;
        }
    },

    async deriveSecret(serverPublicKeyPEM, clientPrivateKey, salt) {
        try {
            const serverPublicKey = await this._importServerPublicKey(serverPublicKeyPEM);
            const sharedSecret = await window.crypto.subtle.deriveBits({name: "ECDH", public: serverPublicKey}, clientPrivateKey, 384);
            const sharedSecretBytes = new Uint8Array(sharedSecret);
            let i = 0;
            while (i < sharedSecretBytes.length && sharedSecretBytes[i] === 0) i++;
            const normalizedSecret = sharedSecretBytes.slice(i);
            const hkdfkey = await window.crypto.subtle.importKey("raw", normalizedSecret, {name: "HKDF", hash: "SHA-256"}, false, ["deriveKey"]);
            const aesKey = await window.crypto.subtle.deriveKey({name: "HKDF", hash: "SHA-256", salt: salt, info: new TextEncoder().encode("vaultart_ecdh")},
                            hkdfkey, {name: "AES-GCM", length: 256}, true, ["encrypt", "decrypt"]);
            const rawKey = await window.crypto.subtle.exportKey("raw", aesKey);
            const keyHex = Array.from(new Uint8Array(rawKey)).map(b => b.toString(16).padStart(2, '0')).join('');
            return aesKey;
        }
        catch(error) {
            console.error("Error al derivar el secreto: ", error);
            throw error;
        }
    },

    async encryptData(data, sharedSecret) {
        try {
            const nonce = window.crypto.getRandomValues(new Uint8Array(12));
            const encodeData = new TextEncoder().encode(JSON.stringify(data))
            const encrypted = await window.crypto.subtle.encrypt({name: "AES-GCM", iv: nonce, additionalData: new TextEncoder().encode("vaultart_ecdh")}, 
                            sharedSecret, encodeData);
            return {ciphertext: this._arrayBufferToBase64(encrypted), nonce: this._arrayBufferToBase64(nonce)}
        }
        catch(error) {
            console.error("Error al cifrar los datos: ", error);
            throw error;
        }
    },

    async decryptData(data, sharedSecret) {
        try {
            const ciphertext = this._base64ToArrayBuffer(data.ciphertext);
            const nonce = this._base64ToArrayBuffer(data.nonce);
            const decrypted = await window.crypto.subtle.decrypt({name: "AES-GCM", iv: nonce, additionalData: new TextEncoder().encode("vaultart_ecdh")}, sharedSecret, ciphertext);
            return JSON.parse(new TextDecoder().decode(decrypted));
        }
        catch(error) {
            console.error("Error al descifrar los datos: ", error);
            throw error;
        }
    },

    async initSession() {
        try {
            const serverPublicKeyPEM = await this.getServerPublicKey();
            const keyPair = await this.generateKeyPair();
            const salt = window.crypto.getRandomValues(new Uint8Array(16));
            const sharedSecret = await this.deriveSecret(serverPublicKeyPEM, keyPair.privateKey, salt);
            const clientPublicKeyPEM = await this.exportPublicKeyPEM(keyPair.publicKey);
            return {keyPair, sharedSecret, clientPublicKeyPEM, salt: this._arrayBufferToBase64(salt)};
        }
        catch(error) {
            console.error("Error al iniciar sesión: ", error);
            throw error;
        }
    },

    _arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer)
        let binary = ''
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        return btoa(binary)
    },

    _base64ToArrayBuffer(base64) {
        const binary = atob(base64)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i)
        }
        return bytes.buffer
    },

    async _importServerPublicKey(pem) {
        const base64 = pem.replace(/-----BEGIN PUBLIC KEY-----/, '')
                          .replace(/-----END PUBLIC KEY-----/, '')
                          .replace(/\s/g, '')
        const binary = atob(base64)
        const buffer = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
            buffer[i] = binary.charCodeAt(i)
        }
        
        return await window.crypto.subtle.importKey(
            "spki",
            buffer,
            { name: "ECDH", namedCurve: "P-384" },
            true,
            []
        )
    }
}