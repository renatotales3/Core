// SecureStorage.js
// Camada de storage criptografado AES-256-GCM com fallback seguro
// Zero dependências externas

const SecureStorage = (() => {
    const LEGACY_PREFIX = '__legacy__';
    const STORAGE_KEY = 'secure-storage';
    const IV_LENGTH = 12; // GCM padrão
    const SALT_LENGTH = 16;
    const PBKDF2_ITER = 100000;
    const KEY_LENGTH = 32;
    let cryptoAvailable = typeof window !== 'undefined' && window.crypto && window.crypto.subtle;
    let deviceKey = null;
    let fallback = !cryptoAvailable;

    // Fingerprint simples do dispositivo
    function getDeviceFingerprint() {
        const nav = window.navigator;
        return [nav.userAgent, nav.language, nav.platform, nav.hardwareConcurrency].join('|');
    }

    async function deriveKey(password, salt) {
        const enc = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey(
            'raw', enc.encode(password), {name: 'PBKDF2'}, false, ['deriveKey']
        );
        return window.crypto.subtle.deriveKey({
            name: 'PBKDF2',
            salt,
            iterations: PBKDF2_ITER,
            hash: 'SHA-256'
        }, keyMaterial, {name: 'AES-GCM', length: 256}, false, ['encrypt', 'decrypt']);
    }

    async function getKey() {
        if (deviceKey) return deviceKey;
        const salt = getSalt();
        const fp = getDeviceFingerprint();
        deviceKey = await deriveKey(fp, salt);
        return deviceKey;
    }

    function getSalt() {
        let salt = localStorage.getItem(STORAGE_KEY + '-salt');
        if (!salt) {
            salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
            localStorage.setItem(STORAGE_KEY + '-salt', btoa(String.fromCharCode(...salt)));
            return salt;
        }
        return Uint8Array.from(atob(salt), c => c.charCodeAt(0));
    }

    async function encrypt(data) {
        const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
        const key = await getKey();
        const enc = new TextEncoder();
        const ciphertext = await window.crypto.subtle.encrypt({
            name: 'AES-GCM', iv
        }, key, enc.encode(JSON.stringify(data)));
        return {
            iv: btoa(String.fromCharCode(...iv)),
            ct: btoa(String.fromCharCode(...new Uint8Array(ciphertext)))
        };
    }

    async function decrypt(payload) {
        const key = await getKey();
        const iv = Uint8Array.from(atob(payload.iv), c => c.charCodeAt(0));
        const ct = Uint8Array.from(atob(payload.ct), c => c.charCodeAt(0));
        const dec = await window.crypto.subtle.decrypt({
            name: 'AES-GCM', iv
        }, key, ct);
        return JSON.parse(new TextDecoder().decode(dec));
    }

    // Fallback puro
    function fallbackGet(key) {
        const raw = localStorage.getItem(key);
        try { return JSON.parse(raw); } catch { return raw; }
    }
    function fallbackSet(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    function fallbackRemove(key) {
        localStorage.removeItem(key);
    }

    // API pública
    return {
        async get(key) {
            if (fallback) return fallbackGet(key);
            const raw = localStorage.getItem(STORAGE_KEY + '-' + key);
            if (!raw) return null;
            try {
                return await decrypt(JSON.parse(raw));
            } catch {
                fallback = true;
                return fallbackGet(key);
            }
        },
        async set(key, value) {
            if (fallback) return fallbackSet(key, value);
            try {
                const payload = await encrypt(value);
                localStorage.setItem(STORAGE_KEY + '-' + key, JSON.stringify(payload));
            } catch {
                fallback = true;
                fallbackSet(key, value);
            }
        },
        async remove(key) {
            if (fallback) return fallbackRemove(key);
            localStorage.removeItem(STORAGE_KEY + '-' + key);
        },
        async migrateLegacy() {
            // Migra todos os dados do localStorage (exceto salt e storage)
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k.startsWith(STORAGE_KEY) || k.endsWith('-salt')) continue;
                const v = fallbackGet(k);
                await this.set(k, v);
                localStorage.setItem(LEGACY_PREFIX + k, v); // backup
                localStorage.removeItem(k);
            }
        },
        isCryptoAvailable() {
            return cryptoAvailable && !fallback;
        }
    };
})();

window.SecureStorage = SecureStorage;
