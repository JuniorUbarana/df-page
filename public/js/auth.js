import supabase from '../../services/supabase.js';

/**
 * Fazer login na aplicação
 * @param {string} email
 * @param {string} password
 */
export async function loginUser(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        throw error;
    }
    return data;
}

/**
 * Fazer logout da aplicação
 */
export async function logoutUser() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        throw error;
    }
}

/**
 * Verificar se o usuário está logado
 * @returns {Promise<boolean>} Retorna true se estiver logado
 */
export async function isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
}

/**
 * Obter usuário atual
 */
export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}
