/**
 * O DESENHO da marca do produto — símbolo e logotipo — como geometria pura.
 *
 * Mora aqui, e não num arquivo em `public/`, por duas razões que a doutrina de
 * marca própria já paga:
 *
 *  1. `public/` é servido a todo mundo, sempre. Um arquivo fixo ali seria a
 *     marca do PRODUTO na instalação de um revendedor que configurou a dele —
 *     é exatamente o vazamento que `tests/unit/branding.test.ts` vigia. Como
 *     geometria, o desenho só aparece onde um componente decide que a marca em
 *     vigor é a padrão (`marcaEhADoProduto`, em `lib/branding.ts`).
 *  2. O favicon (`app/icon.tsx`) é gerado em runtime pelo `ImageResponse`, que
 *     aceita SVG inline mas não lê arquivo do disco. Um único desenho alimenta
 *     a tela e o ícone — dois arquivos divergiriam na primeira revisão da marca.
 *
 * As cores NÃO estão aqui de propósito: quem desenha escolhe (a tela lê os
 * tokens do tema; o favicon lê a régua do produto). A fonte deste desenho são
 * os PNGs em `docs/brand/` (`icone.png`, `logo-claro.png`, `logo-escuro.png`),
 * vetorizados à mão; ao trocar a arte, refaça a geometria a partir deles.
 */

/**
 * O "P" inclinado com o contra-forma aberta à esquerda, em coordenadas da arte
 * original (caixa de 715 × 448).
 */
const CORPO =
  "M248 0H543C638 0 715 68 715 149C715 230 638 298 543 298H313C282 298 257 311 235 332L145 448H0L148 253C175 218 210 200 248 200H535C565 200 587 178 587 153C587 128 565 107 535 107H131Z";

/** O paralelogramo azul que destaca a base do "P". */
const DESTAQUE = "M188 448H325L419 332H308C285 332 268 342 255 358Z";

/** O símbolo num quadrado, para o ícone da aba e a barra recolhida. */
export const SIMBOLO = {
  viewBox: "-20 -154 755 755",
  d: CORPO,
  destaque: DESTAQUE,
} as const;

/** O logotipo do cabeçalho: o mesmo símbolo, na caixa justa da arte. */
export const LOGOTIPO = {
  viewBox: "0 0 715 448",
  /** Proporção largura/altura do `viewBox`, para dimensionar por altura. */
  proporcao: 715 / 448,
  d: CORPO,
  destaque: DESTAQUE,
} as const;

/**
 * As cores da marca do produto, por tema — amostradas dos PNGs de
 * `docs/brand/`: corpo preto no claro e branco no escuro, destaque azul nos dois.
 */
export const CORES_DA_MARCA = {
  claro: { corpo: "#040303", destaque: "#0026fd" },
  escuro: { corpo: "#fffdfd", destaque: "#0026fd" },
} as const;
