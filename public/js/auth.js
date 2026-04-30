import { auth } from '../../services/firebase.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

/**
 * Fazer login na aplicação
 * @param {string} email
 * @param {string} password
 */
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user };
    } catch (error) {
        throw error;
    }
}

/**
 * Fazer logout da aplicação
 */
export async function logoutUser() {
    try {
        await signOut(auth);
    } catch (error) {
        throw error;
    }
}

/**
 * Verificar se o usuário está logado
 * @returns {Promise<boolean>} Retorna true se estiver logado
 */
export async function isAuthenticated() {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(!!user);
        });
    });
}

/**
 * Obter usuário atual
 */
export async function getCurrentUser() {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
}
