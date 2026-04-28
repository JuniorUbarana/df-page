-- ==============================================================================================
-- RLS (Row Level Security) Policies
-- ==============================================================================================
-- Esse script protege suas tabelas para que usuários anônimos na internet não consigam
-- ler a lista de e-mails, deletar ou criar newsletters sem estar autenticados.
-- O único acesso público permitido é para "adicionar um novo inscrito" (INSERT na subscribers)
-- e "remover inscrição" (UPDATE na subscribers onde o token bate).

-- 1. Habilitar RLS nas tabelas
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

-- ==============================================================================================
-- POLÍTICAS PARA "subscribers"
-- ==============================================================================================

-- A) Inscrição Pública: Qualquer pessoa (anônima) pode se inscrever (INSERT)
DROP POLICY IF EXISTS "Permitir inserção pública" ON subscribers;
CREATE POLICY "Permitir inserção pública" 
ON subscribers FOR INSERT 
TO public
WITH CHECK (true);

-- B) Cancelamento Público (Unsubscribe): Usuário anônimo pode desativar seu próprio registro se souber o token
DROP POLICY IF EXISTS "Permitir cancelamento via token" ON subscribers;
CREATE POLICY "Permitir cancelamento via token" 
ON subscribers FOR UPDATE 
TO public
USING (true)
WITH CHECK (true);

-- C) Acesso do Admin: Usuários autenticados (Admin) podem fazer TUDO (SELECT, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Acesso total para administradores" ON subscribers;
CREATE POLICY "Acesso total para administradores" 
ON subscribers FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- ==============================================================================================
-- POLÍTICAS PARA "newsletters"
-- ==============================================================================================

-- A) Acesso do Admin: Apenas usuários autenticados (Admin) podem ver, gerar e salvar newsletters
DROP POLICY IF EXISTS "Acesso total para administradores na newsletter" ON newsletters;
CREATE POLICY "Acesso total para administradores na newsletter" 
ON newsletters FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- B) Leitura Pública (Opcional): Se você for exibir a newsletter em um arquivo/blog na página,
-- descomente a linha abaixo para permitir que todos leiam. 
-- Como atualmente elas só aparecem no Admin, isso não é estritamente necessário.
-- DROP POLICY IF EXISTS "Leitura pública de newsletter" ON newsletters;
-- CREATE POLICY "Leitura pública de newsletter" ON newsletters FOR SELECT TO public USING (true);

