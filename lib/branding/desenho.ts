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
 * O umbu: a fruta (corpo verde-limão, a face verde-escura que desce da aba, a
 * aba com a dobra e a folha em dois tons), com o "U" vazado no meio — o vazado
 * mostra o fundo, então a fruta serve no tema claro, no escuro e no menu verde.
 * As letras "UMBU" e "CRM" são contornos da Nunito Black, para não depender de
 * fonte instalada. A fonte deste desenho são os PNGs de `docs/brand/`,
 * redesenhados em vetor; ao trocar a arte, refaça a geometria a partir deles.
 */

/** As cores da fruta: degradês (de, para, direção) e a dobra chapada. */
export const DEGRADES = {
  corpo: {
    x1: 0,
    y1: 0,
    x2: 0.35,
    y2: 1,
    paradas: [
      [0, "#cfe424"],
      [1, "#6aac1c"],
    ],
  },
  face: {
    x1: 1,
    y1: 0,
    x2: 0.3,
    y2: 1,
    paradas: [
      [0, "#93c31a"],
      [0.55, "#3f8a22"],
      [1, "#146222"],
    ],
  },
  aba: {
    x1: 0,
    y1: 0,
    x2: 1,
    y2: 1,
    paradas: [
      [0, "#cde52e"],
      [1, "#b3d61f"],
    ],
  },
  folhaEscura: {
    x1: 0,
    y1: 1,
    x2: 1,
    y2: 0,
    paradas: [
      [0, "#2f8a1f"],
      [1, "#5aa51a"],
    ],
  },
  folhaClara: {
    x1: 0,
    y1: 1,
    x2: 1,
    y2: 0,
    paradas: [
      [0, "#7fbb16"],
      [1, "#c2de25"],
    ],
  },
} as const satisfies Record<
  string,
  {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    paradas: readonly (readonly [number, string])[];
  }
>;

export type Degrade = keyof typeof DEGRADES;

/**
 * As partes da fruta, na ordem de pintura, em coordenadas da arte (a fruta
 * ocupa x 43–559, y 83–712). O corpo usa `evenodd`: o segundo contorno é o "U".
 */
export const FRUTA: readonly { d: string; degrade?: Degrade; cor?: string; evenodd?: boolean }[] = [
  {
    d: "M213 233H389A170 170 0 0 1 559 403V497A215 215 0 0 1 344 712H258A215 215 0 0 1 43 497V403A170 170 0 0 1 213 233ZM284 392V522A62 62 0 0 0 408 522V392Z",
    degrade: "corpo",
    evenodd: true,
  },
  {
    d: "M284 395C225 420 160 480 152 570C146 625 160 672 186 699.6A215 215 0 0 0 258 712H344A215 215 0 0 0 559 497V403A170 170 0 0 0 389 233H300V392H408V522A62 62 0 0 1 284 522Z",
    degrade: "face",
  },
  { d: "M284 233H298C350 258 395 300 410 368V372C410 384 401 392 389 392H284Z", degrade: "aba" },
  { d: "M298 233H378C392 250 405 280 410 310V368C395 300 350 258 298 233Z", cor: "#0d4a0e" },
  { d: "M322 232C312 150 400 85 543 85C470 130 400 180 322 232Z", degrade: "folhaEscura" },
  { d: "M322 232C400 180 470 130 543 85C525 180 440 232 322 232Z", degrade: "folhaClara" },
];

/** O símbolo (só a fruta) num quadrado, para o ícone da aba e a barra recolhida. */
export const SIMBOLO = {
  viewBox: "-34 63 670 670",
} as const;

/** O logotipo do cabeçalho: a fruta e, à direita, "UMBU" com "CRM" embaixo. */
export const LOGOTIPO = {
  viewBox: "33 73 1733 649",
  /** Proporção largura/altura do `viewBox`, para dimensionar por altura. */
  proporcao: 1733 / 649,
  nome: "M756.6 574.9Q729.6 574.9 709 568Q688.4 561.2 674.2 547.5Q660 533.9 652.8 513.4Q645.6 492.9 645.6 466V353.6Q645.6 337.6 654 329.3Q662.5 321.1 677.9 321.1Q693.6 321.1 701.8 329.3Q710 337.6 710 353.6V466.7Q710 493.6 722 507.3Q733.9 521 756.6 521Q779 521 790.9 507.3Q802.8 493.6 802.8 466.7V353.6Q802.8 337.6 811 329.3Q819.2 321.1 834.6 321.1Q850 321.1 858.1 329.3Q866.1 337.6 866.1 353.6V466Q866.1 502.1 853.7 526.4Q841.3 550.7 816.8 562.8Q792.3 574.9 756.6 574.9Z M956.4 574.1Q942.4 574.1 934.9 566.5Q927.4 558.8 927.4 544.8V350.5Q927.4 336.1 935.5 328.6Q943.5 321.1 958.2 321.1Q970.4 321.1 977.6 325.8Q984.8 330.6 990.8 341.4L1059.7 465.6L1128.6 341.4Q1134.9 330.6 1142.1 325.8Q1149.3 321.1 1161.5 321.1Q1175.5 321.1 1183.1 328.6Q1190.6 336.1 1190.6 350.5V544.8Q1190.6 558.8 1183.2 566.5Q1175.9 574.1 1161.5 574.1Q1147.5 574.1 1140 566.5Q1132.5 558.8 1132.5 544.8V437.3L1083.5 522.4Q1078.6 530 1073.2 533.9Q1067.8 537.8 1058.6 537.8Q1049.9 537.8 1044.3 533.9Q1038.7 530 1034.1 522.4L985.5 438V544.8Q985.5 558.8 978.1 566.5Q970.8 574.1 956.4 574.1Z M1287.2 571Q1270.7 571 1262.2 562.4Q1253.6 553.9 1253.6 537.8V357.5Q1253.6 341.4 1262.2 332.8Q1270.7 324.2 1287.2 324.2H1372.6Q1399.2 324.2 1417.9 332.1Q1436.6 340 1446.4 354.4Q1456.2 368.7 1456.2 388Q1456.2 409.6 1444 425.1Q1434.5 436.6 1419.8 442.9Q1438 448.1 1449.2 460.8Q1462.9 476.5 1462.9 501Q1462.9 533.5 1439.6 552.3Q1416.3 571 1376.1 571ZM1315.2 523.8H1367.3Q1385.2 523.8 1393.4 516.9Q1401.6 510.1 1401.6 496.5Q1401.6 482.8 1393.4 476.1Q1385.2 469.5 1367.3 469.5H1315.2ZM1315.2 422.2H1361Q1378.5 422.2 1386.8 415.9Q1395 409.6 1395 396.7Q1395 383.8 1386.8 377.6Q1378.5 371.5 1361 371.5H1315.2Z M1626 574.9Q1599 574.9 1578.4 568Q1557.7 561.2 1543.6 547.5Q1529.4 533.9 1522.2 513.4Q1515 492.9 1515 466V353.6Q1515 337.6 1523.4 329.3Q1531.8 321.1 1547.2 321.1Q1563 321.1 1571.2 329.3Q1579.4 337.6 1579.4 353.6V466.7Q1579.4 493.6 1591.3 507.3Q1603.2 521 1626 521Q1648.4 521 1660.3 507.3Q1672.2 493.6 1672.2 466.7V353.6Q1672.2 337.6 1680.4 329.3Q1688.6 321.1 1704 321.1Q1719.4 321.1 1727.5 329.3Q1735.5 337.6 1735.5 353.6V466Q1735.5 502.1 1723.1 526.4Q1710.7 550.7 1686.2 562.8Q1661.7 574.9 1626 574.9Z",
  sufixo:
    "M1448.9 705.4Q1434.3 705.4 1423.8 699.8Q1413.3 694.1 1407.8 683.9Q1402.2 673.6 1402.2 659.9Q1402.2 649.6 1405.4 641.2Q1408.6 632.9 1414.6 626.9Q1420.7 620.9 1429.4 617.7Q1438.1 614.5 1448.9 614.5Q1454.7 614.5 1460.9 615.8Q1467.1 617.1 1471.8 619.8Q1475.3 621.6 1476.7 624.5Q1478.1 627.4 1477.6 630.4Q1477.2 633.4 1475.4 635.8Q1473.7 638.1 1470.9 638.9Q1468.2 639.8 1464.9 638.1Q1461.2 636.4 1457.5 635.4Q1453.8 634.5 1449.8 634.5Q1442.1 634.5 1436.9 637.4Q1431.7 640.4 1429.1 646Q1426.4 651.6 1426.4 659.9Q1426.4 668.1 1429.1 673.8Q1431.7 679.5 1436.9 682.4Q1442.1 685.4 1449.8 685.4Q1453.1 685.4 1456.8 684.6Q1460.6 683.8 1464.2 682Q1467.9 680.4 1470.9 681.1Q1473.8 681.9 1475.6 684.1Q1477.4 686.4 1477.9 689.3Q1478.4 692.2 1477.1 695.1Q1475.8 698 1472.6 699.8Q1468.2 702.4 1461.8 703.9Q1455.3 705.4 1448.9 705.4Z M1539.4 705.1Q1533.9 705.1 1530.9 702.1Q1527.9 699 1527.9 693.5V627.5Q1527.9 621.9 1531 618.9Q1534.1 615.9 1539.6 615.9H1570.3Q1585.3 615.9 1593.5 623.2Q1601.7 630.5 1601.7 643.5Q1601.7 651.9 1598 658.1Q1594.3 664.2 1587.4 667.5Q1585.2 668.6 1582.7 669.4Q1584.8 670 1586.8 671.1Q1590.9 673.8 1593.7 679L1599.9 690.2Q1601.9 693.9 1601.8 697.3Q1601.7 700.8 1599.1 702.9Q1596.6 705.1 1591.7 705.1Q1586.8 705.1 1583.8 703.1Q1580.7 701.1 1578.3 696.9L1566.9 676Q1565.4 673.2 1563.1 672.2Q1560.8 671.1 1557.8 671.1H1550.9V693.5Q1550.9 699 1548.1 702.1Q1545.2 705.1 1539.4 705.1ZM1550.9 654.9H1566.2Q1572.8 654.9 1576.3 652.2Q1579.8 649.6 1579.8 644.1Q1579.8 638.9 1576.3 636.2Q1572.8 633.5 1566.2 633.5H1550.9Z M1664.3 705.1Q1659.3 705.1 1656.6 702.4Q1653.9 699.6 1653.9 694.6V625.2Q1653.9 620.1 1656.8 617.4Q1659.7 614.8 1664.9 614.8Q1669.3 614.8 1671.9 616.4Q1674.4 618.1 1676.6 622L1701.2 666.4L1725.8 622Q1728.1 618.1 1730.6 616.4Q1733.2 614.8 1737.6 614.8Q1742.6 614.8 1745.3 617.4Q1747.9 620.1 1747.9 625.2V694.6Q1747.9 699.6 1745.3 702.4Q1742.7 705.1 1737.6 705.1Q1732.6 705.1 1729.9 702.4Q1727.2 699.6 1727.2 694.6V656.2L1709.7 686.6Q1707.9 689.4 1706 690.8Q1704.1 692.1 1700.8 692.1Q1697.7 692.1 1695.7 690.8Q1693.7 689.4 1692.1 686.6L1674.7 656.5V694.6Q1674.7 699.6 1672.1 702.4Q1669.4 705.1 1664.3 705.1Z",
} as const;

/**
 * As cores das letras, por tema: "UMBU" verde-escuro no claro e quase branco no
 * escuro; "CRM" verde-limão nos dois (mais aceso no escuro). A fruta não muda.
 */
export const CORES_DA_MARCA = {
  claro: { nome: "#0b3d1e", sufixo: "#5f9e17" },
  escuro: { nome: "#eef5ea", sufixo: "#a6d930" },
} as const;
