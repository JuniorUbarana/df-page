-- Tabela: subscribers
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribe_token TEXT UNIQUE NOT NULL
);

-- Tabela: newsletters
CREATE TABLE IF NOT EXISTS newsletters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: news_items (Para controle de duplicidade)
CREATE TABLE IF NOT EXISTS news_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    link TEXT NOT NULL,
    hash TEXT UNIQUE NOT NULL, -- Hash do conteúdo ou link para evitar duplicatas
    newsletter_id UUID REFERENCES newsletters(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) - Básico para MVP
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pública (cadastro)
CREATE POLICY "Permitir inserção pública" ON subscribers FOR INSERT WITH CHECK (true);

-- Política para leitura e remoção (Para o Dashboard Administrativo funcionar)
-- IMPORTANTE: Em produção, restringe estas políticas a usuários autenticados.
CREATE POLICY "Leitura pública para dashboard" ON subscribers FOR SELECT USING (true);
CREATE POLICY "Remoção pública para dashboard" ON subscribers FOR DELETE USING (true);

CREATE POLICY "Leitura pública de newsletters" ON newsletters FOR SELECT USING (true);
CREATE POLICY "Inserção de newsletters" ON newsletters FOR INSERT WITH CHECK (true);

CREATE POLICY "Leitura de news_items" ON news_items FOR SELECT USING (true);
CREATE POLICY "Inserção de news_items" ON news_items FOR INSERT WITH CHECK (true);
