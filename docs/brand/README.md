# Marca

| Arquivo | O que é |
|---|---|
| `icone.png` | O símbolo quadrado (512×512): o "P" inclinado com o destaque azul. Fonte do ícone da aba e do app. |
| `logo-claro.png` | Logo do cabeçalho para fundo claro: corpo preto `#040303`, destaque azul `#0026fd`. |
| `logo-escuro.png` | Logo do cabeçalho para fundo escuro: corpo branco `#fffdfd`, destaque azul `#0026fd`. |

**Estes PNGs são a fonte; o app NÃO os lê.** A geometria foi vetorizada à mão em
`lib/branding/desenho.ts` e é desenhada inline por `components/branding/MarcaDoProduto.tsx`
(barra lateral, fachada de entrada, onboarding) e por `app/icon.tsx` e
`lib/branding/icone-do-app.tsx` (ícone da aba e do app instalado) — e só aparece quando
ninguém configurou marca própria (`marcaEhADoProduto`, em `lib/branding.ts`).
Um arquivo em `public/` seria servido na instalação de todo revendedor, que é o vazamento
que `tests/unit/branding.test.ts` existe para impedir. Ao revisar a arte, troque os PNGs
aqui **e** refaça a geometria do `desenho.ts`; `tests/unit/marca-do-produto.test.tsx`
cobra que as cores do componente e da paleta coincidam.

Os READMEs (pt, en, es) usam os PNGs diretamente, num `<picture>` que troca para a
versão escura conforme o tema do GitHub.
