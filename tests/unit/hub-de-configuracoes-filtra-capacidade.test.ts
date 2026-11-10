/**
 * O hub de Configurações mostrava o cartão "Modelos de proposta" com as
 * propostas desligadas, e o cartão levava ao 404 do layout delas
 * (`app/app/settings/tenant/proposals/layout.tsx`). O menu lateral já filtrava
 * por capacidade; o hub não recebia a lista.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { hubSections } from "@/lib/navigation/registry";

const MODELOS = "/app/settings/tenant/proposals/modelos";
const hrefs = (capacidades: Parameters<typeof hubSections>[5]) =>
  hubSections("organizacao", false, "admin", undefined, ["propostas"], capacidades).flatMap((s) =>
    s.items.map((i) => i.href),
  );

describe("hub de Configurações e a capacidade de propostas", () => {
  it("sem a capacidade, o cartão dos modelos não aparece", () => {
    expect(hrefs([])).not.toContain(MODELOS);
  });

  it("com a capacidade, o cartão aparece", () => {
    expect(hrefs(["propostas"])).toContain(MODELOS);
  });

  it("a página do hub passa as capacidades da organização ao NavHub", () => {
    const pagina = fs.readFileSync(path.join(process.cwd(), "app/app/settings/page.tsx"), "utf8");
    expect(pagina).toMatch(/capacidadesDaOrganizacao\(/);
    expect(pagina).toMatch(/capacidadesLigadas=\{capacidadesLigadas\}/);
  });
});
