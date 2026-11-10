---
trigger: always_on
description: Guias do assistente do PJ CRM — quando usar cada um
---

Este repositório embute guias (skills em `.agents/skills/`) para situações recorrentes. Quando o pedido
casar, carregue o guia antes de agir — a pessoa pode não saber que ele existe:

- instalar, subir, atualizar, consertar a instalação numa VPS, domínio, Supabase, WhatsApp
  que não conecta → `pjcrm-instalar`
- usar o CRM no dia a dia, encontrar uma tela, entender um fluxo ou configurar algo pela interface → `pjcrm-operacao`
- configurar o CRM para um cliente ou nicho (clínica, imobiliária, serviços, curso, loja,
  escritório de advocacia): agentes, roteadores, follow-ups, base de conhecimento → `pjcrm-cliente-novo`
- revender o CRM como SaaS: painel do dono, planos, teste grátis, cobrar os clientes pela Stripe ou pelo
  Asaas, régua de atraso, nota fiscal, contrato com o cliente final → `pjcrm-saas`
- desempenho, conversão, custo de IA, funil, relatório, "o agente está vendendo?" → `pjcrm-metricas`
- o agente responde errado, passa tudo para humano, não usa a agenda, melhorar o prompt → `pjcrm-prompt`
- contribuir, corrigir um bug, abrir ou atualizar um PR, migration, conflito com a main → `pjcrm-contribuir`
  (rode `bash .agents/skills/pjcrm-contribuir/scripts/quem-sou.sh` primeiro: se disser
  `mantenedor`, este guia fica quieto)
- criar extensão, plugin, módulo ou tema de nicho; "isto é núcleo ou extensão?" → `pjcrm-extensao`
- atualizar aulas, traduções e capturas do curso visual após mudanças do CRM → `pjcrm-curso`

Escrevendo código aqui: `pjcrm-doutrina` (as regras que mais custam) e `sistema-vivo` (o gate
de arquitetura). A doutrina completa é o `CLAUDE.md` da raiz; o contrato portável é o `AGENTS.md`.
