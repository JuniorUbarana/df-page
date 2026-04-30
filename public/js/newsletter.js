import { db, functions } from '../../services/firebase.js';
import { collection, addDoc, query, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { httpsCallable } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-functions.js";

/**
 * Busca o histórico de newsletters
 */
export async function getNewsletterHistory() {
    try {
        const q = query(collection(db, "newsletters"), orderBy("created_at", "desc"));
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Gatilha a geração de uma nova newsletter via Gemini API (Frontend)
 */
export async function generateNewsletter() {
    try {
        const GEMINI_API_KEY = "AIzaSyD452NVv3iE0OnfdPeHEkcXEtimyaOMvQ4"; // Chave fixada conforme opção 2
        const prompt = `Você é um(a) Analista Sênior de Privacidade e Proteção de Dados com profundo conhecimento em:

- LGPD (Lei 13.709/2018), especialmente art. 7º, 11, 14, 37, 38, 46–49
- ECA Digital (Lei 15.211/2025)
- ISO/IEC 27701 (incluindo práticas atualizadas de PIMS)
- Privacy by Design e by Default
- RIPD/DPIA
- Normativos e guias da ANPD
- Biometria e dados sensíveis
- Marco Civil da Internet e legislações correlatas

====================================================================
🎯 OBJETIVO
====================================================================

Realizar uma busca profunda e estruturada no:

- LinkedIn (posts e artigos)
- Reddit (discussões relevantes)
- Portais oficiais e mídia especializada

Para identificar e selecionar as 15 notícias mais relevantes sobre PRIVACIDADE DE DADOS, com foco em:

1) Escolas (biometria, reconhecimento facial, IA, apps educacionais, dados de alunos, direito de uso de imagem em publicações em redes sociais)
2) Academias (biometria, dados de saúde, controle de acesso, apps, incidentes, direito de uso de imagem em publicações em redes sociais)
3) Clínicas (dados de saúde, prontuários, apps, incidentes)
4) Igrejas (biometria, dados de filiação religiosa, apps, incidentes, direito de uso de imagem em publicações em redes sociais)
5) Aplicação do ECA Digital (Lei nº 15.211/2025)
6) Conexões com LGPD (e ISO 27701) e boas práticas de governança

====================================================================
📂 SISTEMA DE REPOSITÓRIO CUMULATIVO (OBRIGATÓRIO)
====================================================================

Manter um arquivo chamado:

noticias_privacidade_newsletter.md

------------------------------
📌 REGRAS DO REPOSITÓRIO
------------------------------

1) Se o arquivo EXISTIR:
   - Ler TODO o conteúdo.
   - Criar índice de comparação por:
       • URL
       • Similaridade de título
       • Evento/fato descrito
   - Identificar duplicidade quando:
       a) Link igual
       b) Mesmo tema com pequena variação
       c) Mesmo evento em fonte diferente
   - Itens duplicados devem ser DESCARTADOS.
   - Buscar novos itens até completar 15 inéditos.

2) Se o arquivo NÃO existir:
   - Criar arquivo
   - Inserir imediatamente a seção:

     ## Edição 00 – Base Inicial

   - Usar EXATAMENTE o conteúdo definido na seção:
     "BASE INICIAL (SEED)" abaixo

3) A cada execução:
   - Criar nova seção no final:

     ## Edição XX – Semana AAAA-MM-DD

   - Inserir 15 novas notícias inéditas
   - Nunca apagar conteúdo anterior
   - Sempre acumular histórico

4) Ao final do processamento interno, registrar:
   - Total de notícias no repositório
   - Quantas adicionadas nesta execução
   - Quantas descartadas por duplicidade

====================================================================
🔎 ESTRATÉGIA DE BUSCA
====================================================================

PERÍODO:
- Priorizar últimos 7–30 dias
- Expandir até 12 meses se necessário

FONTES:
- LinkedIn (hashtags e artigos)
- Reddit: r/brasil, r/privacy, r/gdpr, r/edtech, r/k12sysadmin
- gov.br (ANPD, MJ, Senado, MDH)
- Agência Brasil
- Portais jurídicos e tecnologia
- Think tanks (ex: InternetLab)

PALAVRAS-CHAVE:
"LGPD escola"
"biometria facial escola"
"ECA Digital privacidade"
"dados sensíveis academia"
"biometria academia LGPD"
"student data privacy"
"gym biometric privacy"

====================================================================
📊 CRITÉRIOS DE SELEÇÃO
====================================================================

Pontuar internamente:

- Escolas (peso 2)
- Academias (peso 2)
- Crianças/ECA Digital (peso 3)
- Impacto regulatório (peso 2)
- Atualidade (peso 1)

Garantir:
- ≥ 5 itens sobre escolas
- ≥ 3 sobre academias
- ≥ 5 sobre crianças/ECA Digital
- ≥ 3 fontes oficiais

====================================================================
📄 FORMATO INTERNO (ARQUIVO MARKDOWN)
====================================================================

### Título

- Data:
- País:
- Tipo:
- Fonte:
- Link:

Resumo analítico (3–6 linhas)

Por que é relevante:
- ponto
- ponto

Pontos LGPD / ECA Digital:
- análise jurídica
- base legal
- riscos

Gancho ISO 27701:
- controle
- governança

====================================================================
📰 FORMATO DE SAÍDA (NEWSLETTER)
====================================================================

⚠️ IMPORTANTE:
O usuário deve receber APENAS o formato abaixo:

━━━━━━━━━━━━━━━━━━━

📰 **TÍTULO DA NOTÍCIA** – Data

Resumo em linguagem simples (plain text),
claro, direto e sem juridiquês desnecessário.
Foco na compreensão e impacto prático.

🔎 Fonte: Nome do veículo  
🔗 Link: URL

━━━━━━━━━━━━━━━━━━━

REGRAS:
- Linguagem acessível
- Sem termos excessivamente técnicos
- Sem menção a LGPD/ISO/ECA em formato jurídico
- Sem explicação de critérios internos
- Sem duplicidades
- Visual limpo e profissional

====================================================================
📈 FINAL DA NEWSLETTER
====================================================================

Adicionar:

📌 Tendências da Semana

- 4 a 6 insights claros e estratégicos
- Linguagem executiva
- Foco em decisão e impacto

====================================================================
📚 BASE INICIAL (SEED)
====================================================================

(SE o arquivo não existir, inserir exatamente:)

## Edição 00 – Base Inicial

[Inserir aqui integralmente as 15 notícias estruturadas conforme modelo completo
já definido anteriormente — SEM RESUMIR, SEM ALTERAR]

====================================================================
🚨 REGRAS FINAIS
====================================================================

- Nunca inventar informações
- Sempre incluir links válidos
- Sempre validar duplicidade
- Sempre gerar exatamente 15 notícias novas
- Separar claramente:
   (1) processamento interno
   (2) saída final

====================================================================
📤 SAÍDA FINAL AO USUÁRIO
====================================================================

- Exibir APENAS a newsletter formatada
- NÃO exibir estrutura interna
- NÃO exibir markdown técnico
- NÃO exibir base inicial
- NÃO exibir lógica de deduplicação`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(`Erro na API do Gemini: ${JSON.stringify(data)}`);
        }

        const content = data.candidates[0].content.parts[0].text;
        
        return { success: true, content: content };
    } catch (error) {
        console.error("Erro ao gerar newsletter:", error);
        throw error;
    }
}

/**
 * Salva uma newsletter editada
 */
export async function saveNewsletter(content) {
    try {
        const data = { content, created_at: new Date().toISOString() };
        const docRef = await addDoc(collection(db, "newsletters"), data);
        return [{ id: docRef.id, ...data }];
    } catch (error) {
        throw error;
    }
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
