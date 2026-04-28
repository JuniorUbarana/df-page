import supabase from '../../services/supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    const statusMessage = document.getElementById('statusMessage');
    
    // Obter o token da URL (ex: unsubscribe.html?token=xyz123)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        statusMessage.textContent = 'Link inválido. O código de desinscrição não foi encontrado.';
        statusMessage.className = 'status-message error';
        return;
    }

    try {
        statusMessage.textContent = 'Aguarde, processando...';
        statusMessage.className = 'status-message loading';

        // Atualizar o status do usuário para inativo com base no token
        const { data, error } = await supabase
            .from('subscribers')
            .update({ active: false })
            .eq('unsubscribe_token', token)
            .select();

        if (error) {
            throw error;
        }

        if (data && data.length > 0) {
            statusMessage.textContent = 'Você foi desinscrito com sucesso. Não enviaremos mais e-mails para você.';
            statusMessage.className = 'status-message success';
        } else {
            statusMessage.textContent = 'Não encontramos uma inscrição ativa com este código ou você já foi desinscrito.';
            statusMessage.className = 'status-message error';
        }

    } catch (err) {
        console.error('Erro ao desinscrever:', err);
        statusMessage.textContent = 'Ocorreu um erro ao processar a solicitação. Tente novamente mais tarde.';
        statusMessage.className = 'status-message error';
    }
});
