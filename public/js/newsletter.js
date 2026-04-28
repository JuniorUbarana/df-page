import supabase from '../../services/supabase.js';

/**
 * Busca o histórico de newsletters
 */
export async function getNewsletterHistory() {
    const { data, error } = await supabase
        .from('newsletters')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

/**
 * Gatilha a geração de uma nova newsletter via Edge Function
 */
export async function generateNewsletter() {
    const { data, error } = await supabase.functions.invoke('generate-newsletter', {
        method: 'POST'
    });

    if (error) throw error;
    return data;
}

/**
 * Salva uma newsletter editada
 */
export async function saveNewsletter(content) {
    const { data, error } = await supabase
        .from('newsletters')
        .insert([{ content, created_at: new Date().toISOString() }]);

    if (error) throw error;
    return data;
}

/**
 * "Envia" a newsletter (MVP: Loga no console ou marca como enviada)
 */
export async function sendNewsletter(newsletterId) {
    // No futuro, isso chamará o Resend/Sendgrid
    console.log(`Disparando envio para a newsletter ID: ${newsletterId}`);
    
    // Simulação de delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return { success: true, message: "Envio processado com sucesso (Simulado)" };
}
