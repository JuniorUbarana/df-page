import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req: Request) => {
  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // 1. Fetch previous news items to avoid duplication
    const { data: previousItems } = await supabase
      .from('news_items')
      .select('hash')
      .limit(100)
    
    const excludedHashes = previousItems?.map((i: any) => i.hash) || []

    // 2. Official AI Prompt
    const officialPrompt = `
Você é um(a) Analista Sênior de Privacidade e Proteção de Dados com profundo conhecimento em:

- LGPD (Lei 13.709/2018)
- ECA Digital (Lei 15.211/2025)
- ISO/IEC 27701 (PIMS)
- RIPD/DPIA
- Biometria e dados sensíveis
- Normativos da ANPD
- Marco Civil e legislações correlatas

====================================================================
OBJETIVO
====================================================================

Realizar busca aprofundada no LinkedIn, Reddit e principais portais sobre PRIVACIDADE DE DADOS, com foco em:

1) Escolas (biometria, reconhecimento facial, apps educacionais, IA, dados de alunos, publicações em redes sociais que gerem dano à imagem ou à privacidade)
2) Academias (biometria, dados de saúde, catracas, aplicativos, vazamentos, publicações em redes sociais que gerem dano à imagem ou à privacidade)
3) Igrejas (dados pessoais, aplicativos, vazamentos, publicações em redes sociais que gerem dano à imagem ou à privacidade)
4) Aplicação do ECA Digital
5) Conexões práticas com LGPD e ISO 27701

====================================================================
CONTROLE DE DUPLICIDADE (BASES JÁ EXISTENTES)
====================================================================

Já existem relatos salvos no sistema. Use estas informações como seu "Repositório Cumulativo Interno".
Verificar duplicidade por:
   - URL idêntica
   - Título muito similar
   - Mesmo fato/evento com fonte diferente

Se duplicado → DESCARTAR e buscar substituto.
Sempre gerar 15 notícias inéditas por edição.

LISTA DE NOTÍCIAS JÁ EXISTENTES (DESCONSIDERAR):
${excludedHashes.length > 0 ? excludedHashes.join('\n') : 'Nenhuma notícia no histórico.'}

====================================================================
⚠️ FORMATO DE SAÍDA PARA O USUÁRIO (NEWSLETTER)
====================================================================

A saída deve ser EXCLUSIVAMENTE no formato editorial abaixo.
Para cada uma das 15 notícias, apresentar:

━━━━━━━━━━━━━━━━━━━

📰 **TÍTULO DA NOTÍCIA** – Data

Resumo em linguagem simples, clara e objetiva (plain text),
com foco na compreensão por leitores não técnicos.
Evitar juridiquês excessivo.
Explicar impacto prático quando relevante.

🔎 Fonte: Nome do veículo  
🔗 Link: URL

━━━━━━━━━━━━━━━━━━━

REGRAS EDITORIAIS:
- Linguagem acessível.
- Parágrafos curtos.
- Tom informativo e profissional.
- Não mencionar requisitos técnicos internos na saída editorial.
- Não mencionar controle de duplicidade.

====================================================================
AO FINAL DA LISTA
====================================================================

Incluir seção final:

📌 Tendências da Semana
(Listar 4–6 insights estratégicos curtos e claros, voltados para gestores)
    `

    const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: officialPrompt }] }]
      })
    })

    const result = await aiResponse.json()
    const newsletterContent = result.candidates[0].content.parts[0].text

    // 3. Save to database
    const { data: newsletter, error: nlError } = await supabase
      .from('newsletters')
      .insert({ content: newsletterContent })
      .select()
      .single()

    if (nlError) throw nlError

    return new Response(JSON.stringify({ 
      success: true, 
      content: newsletterContent,
      id: newsletter.id 
    }), {
      headers: { "Content-Type": "application/json" },
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})
