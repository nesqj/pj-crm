import { DEGRADES, FRUTA, type Degrade } from "./desenho";

/**
 * A fruta do símbolo como elementos SVG: os degradês em `<defs>` e as partes na
 * ordem de pintura. Serve à tela (`components/branding/MarcaDoProduto.tsx`) e ao
 * `ImageResponse` dos ícones (`app/icon.tsx`, `lib/branding/icone-do-app.tsx`).
 *
 * `prefixo` separa os ids dos degradês: a barra pode desenhar a fruta mais de
 * uma vez na mesma página, e ids repetidos fariam um SVG pintar com o do outro.
 */
export function partesDaFruta(prefixo: string) {
  const id = (nome: Degrade) => `${prefixo}-${nome}`;
  return (
    <>
      <defs>
        {(Object.keys(DEGRADES) as Degrade[]).map((nome) => {
          const { x1, y1, x2, y2, paradas } = DEGRADES[nome];
          return (
            <linearGradient key={nome} id={id(nome)} x1={x1} y1={y1} x2={x2} y2={y2}>
              {paradas.map(([offset, cor]) => (
                <stop key={offset} offset={offset} stopColor={cor} />
              ))}
            </linearGradient>
          );
        })}
      </defs>
      {FRUTA.map((parte, i) => (
        <path
          key={i}
          d={parte.d}
          fill={parte.degrade ? `url(#${id(parte.degrade)})` : parte.cor}
          fillRule={parte.evenodd ? "evenodd" : undefined}
        />
      ))}
    </>
  );
}
