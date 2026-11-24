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
