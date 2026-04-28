import supabase from '../../services/supabase.js';

/**
 * Inscreve um novo usuário na newsletter
 */
export async function subscribeUser(email, name = null) {
    // Gerar um token único para descadastro
    const unsubscribe_token = btoa(email + Date.now()).replace(/=/g, '');

    const { data, error } = await supabase
        .from('subscribers')
        .upsert([
            { 
                email, 
                name, 
                active: true, 
                unsubscribe_token,
                created_at: new Date().toISOString()
            }
        ], { onConflict: 'email' });

    if (error) throw error;
    return data;
}

/**
 * Desinscreve um usuário via token
 */
export async function unsubscribeUser(token) {
    const { data, error } = await supabase
        .from('subscribers')
        .update({ active: false })
        .eq('unsubscribe_token', token);

    if (error) throw error;
    return data;
}

/**
 * Lista todos os usuários (Admin)
 */
export async function listSubscribers() {
    const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

/**
 * Remove um usuário permanentemente (Admin)
 */
export async function deleteSubscriber(id) {
    const { error } = await supabase
        .from('subscribers')
        .delete()
        .eq('id', id);

    if (error) throw error;
}
