# Marca

| Arquivo | O que é |
|---|---|
| `icone.png` | O símbolo quadrado (512×512): a fruta do umbu, com o "U" vazado. Fonte do ícone da aba e do app. |
| `logo-claro.png` | Logo do cabeçalho para fundo claro: a fruta, "UMBU" verde-escuro `#0b3d1e` e "CRM" `#5f9e17`. |
| `logo-escuro.png` | Logo do cabeçalho para fundo escuro: a fruta, "UMBU" claro `#eef5ea` e "CRM" `#a6d930`. |

**Estes PNGs são a fonte; o app NÃO os lê.** A geometria está em `lib/branding/desenho.ts`
(a fruta em degradês e as letras como contornos da Nunito Black) e é desenhada inline por
`components/branding/MarcaDoProduto.tsx` (barra lateral, fachada de entrada, onboarding) e,
via `lib/branding/fruta.tsx`, por `app/icon.tsx` e `lib/branding/icone-do-app.tsx` (ícone da
aba e do app instalado) — e só aparece quando ninguém configurou marca própria
(`marcaEhADoProduto`, em `lib/branding.ts`). Um arquivo em `public/` seria servido na
instalação de todo revendedor, que é o vazamento que `tests/unit/branding.test.ts` existe
para impedir. Ao revisar a arte, troque os PNGs aqui **e** refaça a geometria do
`desenho.ts`; `tests/unit/marca-do-produto.test.tsx` cobra que as cores das letras no
componente e na paleta coincidam.

Os READMEs (pt, en, es) usam os PNGs diretamente, num `<picture>` que troca para a
versão escura conforme o tema do GitHub.

## Como a marca aparece no produto

Capturas do app rodando com a marca padrão (nenhum logo ou nome próprio configurado):

| Tela | Captura |
|---|---|
| Login, tema claro | `evidence/identidade-umbu/1-login-claro.png` |
| Login, tema escuro | `evidence/identidade-umbu/2-login-escuro.png` |
| Menu lateral aberto (verde-escuro de fábrica) | `evidence/identidade-umbu/3-menu-aberto.png` |
| Menu lateral recolhido (só a fruta) | `evidence/identidade-umbu/4-menu-recolhido.png` |
| Menu lateral no tema escuro | `evidence/identidade-umbu/5-menu-tema-escuro.png` |
| Ícone do app, gerado pelo `ImageResponse` | `evidence/identidade-umbu/6-icone-do-app.png` |
| Menu do painel de administração da instalação | `evidence/identidade-umbu/7-menu-do-painel-admin.png` |
| Fundo e cartões esverdeados, tema claro | `evidence/identidade-umbu/8-fundo-claro-esverdeado.png` |
| Fundo e cartões esverdeados, tema escuro | `evidence/identidade-umbu/9-fundo-escuro-esverdeado.png` |
