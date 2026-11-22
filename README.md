<!-- readme-pjcrm: este README é do PJ CRM; scripts/marca-pjcrm.sh o preserva na sincronização -->
<div align="center">

🇧🇷 Português · [🇺🇸 English](README.en.md) · [🇪🇸 Español](README.es.md)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/brand/logo-escuro.png">
  <img src="docs/brand/logo-claro.png" alt="PJ CRM" width="240">
</picture>

# PJ CRM

**CRM de vendas com agentes de IA para o WhatsApp, open source, rodando no seu servidor.**

</div>

---

## Como funciona

O PJ CRM junta numa tela só o **WhatsApp**, o **funil de vendas** e **agentes de IA** que
trabalham junto com a sua equipe:

1. **O cliente manda mensagem no WhatsApp.** O número é conectado por QR code ou pelo canal
   oficial da Meta, e a conversa aparece na **Inbox**.
2. **O agente de IA atende.** Ele responde com o que você ensinou (a base de conhecimento da
   sua empresa), qualifica o cliente, marca horário na agenda e cria o negócio no funil.
3. **A equipe assume quando precisa.** O agente sabe a hora de passar para uma pessoa, e
   qualquer atendente pode entrar na conversa a qualquer momento. Tudo fica registrado.
4. **Nada morre no silêncio.** Follow-ups retomam a conversa que esfriou, automações movem o
   negócio no funil, e a Central avisa o que precisa de decisão humana.
5. **Você acompanha os números.** Desempenho do funil, de cada atendente e o custo da IA.

Serve para clínicas, imobiliárias, lojas, agências, infoprodutos e prestadores de serviço:
o nome das coisas se ajusta ao negócio (lead pode virar *Paciente*, ganho pode virar *Pago*).

Os dados ficam na **sua VPS**, com várias empresas separadas na mesma instalação e LGPD
desde a origem. Não há mensalidade nem recurso travado.

---

## Instalar numa VPS

Você precisa de:

| Item | Detalhe |
|---|---|
| **VPS com Docker** | 4 GB de RAM recomendados. x86_64 ou ARM64 |
| **Domínio** | Um registro **A** apontando para o IP da VPS (ex.: `crm.suaempresa.com.br`) |
| **Banco** | Conta grátis no [supabase.com](https://supabase.com), ou o Supabase na própria VPS |
| **IA** | Uma chave de OpenRouter, Anthropic ou OpenAI |
| **WhatsApp** | O seu número, conectado por QR code no primeiro acesso |

Entre na VPS (`ssh root@SEU_IP`) e rode:

```bash
git clone https://github.com/nesqj/pj-crm.git
cd pj-crm
bash hostgator-setup-kit/install.sh
```

O instalador pergunta só o que é seu (domínio, chaves, senha do admin), valida cada resposta,
aplica o banco, cria o primeiro admin e sobe tudo com HTTPS. Você não compila nada: as imagens
já vêm prontas. Se a VPS já tem um proxy próprio (Hostinger, Coolify, Dokploy), ele detecta.

Depois, abra `https://<seu-domínio>`, entre com o admin e conecte o WhatsApp no onboarding.
A senha inicial, se você não escolheu uma, fica no `.env`, em `OWNER_PASSWORD`.

Detalhes e problemas comuns: [`hostgator-setup-kit/README.md`](hostgator-setup-kit/README.md).

---

## Atualizar

**Pela tela:** quando sai versão nova, o menu lateral mostra **"Nova versão"** para o dono do
servidor. Em **Configurações › Atualização** você vê o que muda e clica em atualizar: o sistema
faz backup do banco, troca a versão e confere se voltou no ar. Se a versão nova falhar, ele
volta sozinho para a anterior.

**Pelo terminal:**

```bash
cd /caminho/do/pj-crm
bash hostgator-setup-kit/update.sh
```

Antes de atualizar, leia a seção da versão no [`CHANGELOG.md`](CHANGELOG.md): o que exige ação
sua aparece em **⚠️ Requer atenção**.

---

## Desenvolvimento

Para mexer no código (para usar o CRM, use o instalador acima):

```bash
git clone https://github.com/nesqj/pj-crm.git
cd pj-crm
nvm use                     # Node 22
pnpm install
cp .env.example .env.local  # guia completo em docs/SETUP.md

# O schema é o baseline.sql (o mesmo que o instalador aplica), não as migrations.
# Num projeto Supabase novo, habilite antes as extensões que o schema usa.
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -c \
  'create extension if not exists vector with schema public;
   create extension if not exists citext with schema public;
   create extension if not exists pg_trgm with schema public;'

psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/baseline.sql

pnpm dev                    # http://localhost:3000
```

Testes: `pnpm typecheck`, `pnpm lint`, `pnpm test:unit` e `pnpm test:db`.

Tecnologia: Next.js, React, TypeScript, Supabase (Postgres com RLS), WAHA para o WhatsApp e
Vercel AI SDK para a IA. Arquitetura em [`ARCHITECTURE.md`](ARCHITECTURE.md), integrações em
[`docs/SETUP.md`](docs/SETUP.md) e o resto da documentação em [`docs/index.md`](docs/index.md).

---

## Problemas

Achou um defeito? Abra uma issue em
[github.com/nesqj/pj-crm/issues](https://github.com/nesqj/pj-crm/issues), com a versão
instalada e o que aconteceu. Falha de segurança: veja [`SECURITY.md`](SECURITY.md).
