import { listSubscribers, deleteSubscriber } from './users.js';
import { getNewsletterHistory, saveNewsletter } from './newsletter.js';
import { isAuthenticated, logoutUser } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is authenticated
    const isAuth = await isAuthenticated();
    if (!isAuth) {
        window.location.href = 'login.html';
        return; // Stop execution
    }

    await refreshDashboard();

    // Event Listeners
    document.getElementById('generateNlBtn').addEventListener('click', handleCreateManual);
    document.getElementById('closePreview').addEventListener('click', togglePreview);
    document.getElementById('saveNlBtn').addEventListener('click', handleSave);
    document.getElementById('discardBtn').addEventListener('click', togglePreview);
    document.getElementById('sendNlBtn').addEventListener('click', handleSend);
    
    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        try {
            await logoutUser();
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Logout error:', error);
            alert('Erro ao sair do sistema.');
        }
    });
});

async function refreshDashboard() {
    try {
        const subscribers = await listSubscribers();
        renderSubscribers(subscribers);

        const history = await getNewsletterHistory();
        renderHistory(history);
        
        updateStats(subscribers, history);
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        // Omitir erros se as tabelas não existirem ainda
    }
}

function renderSubscribers(users) {
    const list = document.getElementById('subscriberList');
    document.getElementById('subscriberCount').textContent = users.length;

    if (users.length === 0) {
        list.innerHTML = `<tr><td colspan="4" class="px-6 py-10 text-center text-gray-500 italic">Nenhum assinante encontrado.</td></tr>`;
        return;
    }

    list.innerHTML = users.map(user => `
        <tr>
            <td class="px-6 py-4 font-medium text-white">${user.name || '—'}</td>
            <td class="px-6 py-4 text-gray-400">${user.email}</td>
            <td class="px-6 py-4 text-gray-400">${new Date(user.created_at).toLocaleDateString()}</td>
            <td class="px-6 py-4 text-right">
                <button onclick="window.handleDeleteUser('${user.id}')" class="text-red-400 hover:text-red-300 transition-colors">Remover</button>
            </td>
        </tr>
    `).join('');
}

window.globalNewsletterHistory = [];

function renderHistory(history) {
    const container = document.getElementById('newsletterHistory');
    window.globalNewsletterHistory = history;
    
    if (history.length === 0) {
        container.innerHTML = `<p class="text-sm text-gray-500 italic text-center py-4">Nenhuma edição encontrada.</p>`;
        return;
    }

    container.innerHTML = history.map(nl => `
        <div onclick="window.viewNewsletter('${nl.id}')" class="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5 hover:border-gold/30 transition-all cursor-pointer">
            <div>
                <p class="text-sm font-medium text-gray-200">Edição de ${new Date(nl.created_at).toLocaleDateString()}</p>
                <p class="text-xs text-gray-500">${nl.content.substring(0, 40)}...</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
        </div>
    `).join('');
}

function updateStats(subscribers, history) {
    if (history.length > 0) {
        document.getElementById('lastGeneration').textContent = new Date(history[0].created_at).toLocaleString();
    }
}

async function handleCreateManual() {
    const textarea = document.getElementById('previewContent');
    textarea.value = '';
    textarea.readOnly = false;
    
    // Restore modal to "Creation" state
    document.querySelector('#previewModal h3').textContent = 'Colar Nova Newsletter';
    document.getElementById('saveNlBtn').style.display = 'block';
    document.getElementById('discardBtn').textContent = 'Cancelar';
    
    togglePreview();
}

async function handleSave() {
    try {
        const content = document.getElementById('previewContent').value;
        if (!content.trim()) {
            alert('A newsletter não pode estar vazia.');
            return;
        }

        const btn = document.getElementById('saveNlBtn');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = 'Salvando...';

        await saveNewsletter(content);
        
        btn.disabled = false;
        btn.innerHTML = originalText;

        togglePreview();
        await refreshDashboard();
        alert('Newsletter salva com sucesso!');
    } catch (error) {
        alert('Erro ao salvar: ' + error.message);
        document.getElementById('saveNlBtn').disabled = false;
        document.getElementById('saveNlBtn').innerHTML = 'Salvar Edição';
    }
}

function togglePreview() {
    const modal = document.getElementById('previewModal');
    modal.classList.toggle('hidden');
}

async function handleSend() {
    const btn = document.getElementById('sendNlBtn');
    const originalText = btn.innerHTML;
    
    try {
        // Pega o histórico para enviar a última newsletter salva
        const history = await getNewsletterHistory();
        if (history.length === 0) {
            alert('Não há nenhuma newsletter salva para enviar.');
            return;
        }
        
        const latestNewsletter = history[0]; // Pega a mais recente
        
        btn.disabled = true;
        btn.innerHTML = 'Enviando...';
        btn.style.opacity = '0.7';
        
        // Importa a função sendNewsletter se ela não estiver importada no topo
        const { sendNewsletter } = await import('./newsletter.js');
        const result = await sendNewsletter(latestNewsletter.id);
        
        alert(result.message || 'Newsletter enviada com sucesso aos assinantes!');
    } catch (error) {
        alert('Erro ao enviar: ' + error.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
        btn.style.opacity = '1';
    }
}

// Global scope for onclick handlers
window.handleDeleteUser = async (id) => {
    if (confirm('Tem certeza que deseja remover este assinante?')) {
        await deleteSubscriber(id);
        await refreshDashboard();
    }
};

window.viewNewsletter = (id) => {
    const nl = window.globalNewsletterHistory.find(n => n.id === id);
    if (!nl) return;

    // Configure modal for "View Only" state
    const modalTitle = document.querySelector('#previewModal h3');
    modalTitle.textContent = `Edição de ${new Date(nl.created_at).toLocaleDateString()}`;
    
    const textarea = document.getElementById('previewContent');
    textarea.value = nl.content;
    textarea.readOnly = true;
    
    // Hide Save button and change discard to Close
    document.getElementById('saveNlBtn').style.display = 'none';
    document.getElementById('discardBtn').textContent = 'Fechar';
    
    togglePreview();
};
