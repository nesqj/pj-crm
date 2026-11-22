# Sincronizar o PJ CRM com o DeskcommCRM

O PJ CRM é o [DeskcommCRM](https://github.com/melgarafael/DeskcommCRM) com outra marca.
A regra de cada sincronização: **a árvore do PJ CRM é a da tag do original, mais a marca
PJ CRM, mais as correções próprias listadas abaixo — e nada além disso.** Tudo o que o
PJ CRM tinha feito de diferente e que o original resolveu de outro jeito volta a ser como
no original.

## O que é próprio do PJ CRM (e precisa sobreviver a cada sincronização)

1. **Trocas mecânicas de marca** — feitas por `scripts/marca-pjcrm.sh` (nomes,
   repositório, imagens `ghcr.io/nesqj/pjcrm{,-worker,-scheduler}`, contêineres,
   caminhos com `deskcomm`, a cor `#506d48` → `#0023fa` nos arquivos simples, o
   `LICENSE` e os derivados: o selo das traduções e o `extensoes/catalogo.json`).
2. **Arquivos de marca desenhados à mão** — o script não os gera; voltam do PJ CRM,
   juntando o que o original tiver mudado neles:
   - `lib/branding/desenho.ts`, `components/branding/MarcaDoProduto.tsx`,
     `app/icon.tsx`, `lib/branding/icone-do-app.tsx`, `lib/branding/regua-do-produto.ts`
   - `app/globals.css` (a rampa azul de `--color-accent-*` e `--color-accent-soft`)
   - `docs/brand/README.md`, `docs/brand/icone.png`, `docs/brand/logo-claro.png` e
     `docs/brand/logo-escuro.png` (os SVG, o og-card e a imagem social de `docs/brand/`
     e as capturas de `evidence/marca/` do original são apagados)
   - os testes de marca: `tests/unit/branding.test.ts`, `branding-contraste.test.ts`,
     `branding-rampa.test.ts`, `handoff-na-raiz-nao-volta.test.ts`,
     `marca-do-produto-nao-se-edita-no-codigo.test.ts`
3. **Correções de segurança anti-SSRF** (commit `4f8f8a4`): redirecionamento da mídia do
   Zernio conferido salto a salto, com a credencial só no host original
   (`lib/channels/adapters/zernio.ts`), e IPv4-mapped em hexadecimal/por extenso em
   `lib/automation/outbound-ip.ts`, com os testes `tests/unit/channel-adapter-zernio.test.ts`
   e `tests/unit/outbound-ip.test.ts`. Quando o original trouxer correção equivalente,
   fique com a dele e tire esta linha.
4. **Os README são do PJ CRM** (`README.md`, `README.en.md`, `README.es.md`, com a marca
   `<!-- readme-pjcrm -->`): não acompanham o original. O script devolve a versão do PJ CRM
   quando a sincronização traz a do original, e apaga o `.all-contributorsrc`, que só servia
   à tabela de contribuidores do README do original.
5. **`CHANGELOG.md`**: as seções 2.x do PJ CRM no topo, acima do histórico 1.x do original.

## O banco

As migrations e o `supabase/baseline.sql` entram como no original, só com a marca. O
script troca apenas nomes de configuração de sessão (`deskcomm.*` → `pjcrm.*`), o
prefixo `deskcommapp` do id de evento do Google e texto de comentário — exatamente o
que já foi trocado no baseline que as instalações aplicaram. Nenhuma tabela, função ou
coluna tem a marca no nome. Confira a cada sincronização:

```bash
git diff -U0 --word-diff=porcelain refs/upstream/vNOVA HEAD -- '*.sql' | grep -E '^[-+]' | sort | uniq -c
```

## Passo a passo

Troque `vANTERIOR` pela tag do original da última sincronização e `vNOVA` pela nova.

```bash
git fetch https://github.com/melgarafael/DeskcommCRM.git refs/tags/vNOVA:refs/upstream/vNOVA
git checkout -b sync/deskcomm-NOVA origin/main
git merge --no-commit --no-ff refs/upstream/vNOVA
git read-tree -u --reset refs/upstream/vNOVA^{tree}
git clean -fd
pnpm install
bash scripts/marca-pjcrm.sh
git add -A
```

Depois disso a árvore é a do original com as trocas mecânicas. Para cada arquivo de marca
do item 2, junte o que o original mudou nele com a versão do PJ CRM (três vias: a base é o
arquivo da tag anterior com a marca aplicada):

```bash
f=lib/branding/desenho.ts   # repita para cada arquivo do item 2
git show refs/upstream/vANTERIOR:"$f" > /tmp/base && perl -0777 -pi -e "$(sed -n '/^read -r -d .. TROCAS/,/^PERL$/p' scripts/marca-pjcrm.sh | sed '1d;$d')" /tmp/base
git show origin/main:"$f" > /tmp/pjcrm
git merge-file -L original -L base -L pjcrm "$f" /tmp/base /tmp/pjcrm
```

Os PNG de `docs/brand/` voltam com `git show origin/main:<arquivo> > <arquivo>`. Reaplique
as correções do item 3 (`git diff 4f8f8a4^ 4f8f8a4 | git apply -3 --index`), acrescente a
seção nova no topo do `CHANGELOG.md` e confira:

```bash
bash scripts/marca-pjcrm.sh --check          # "nada a trocar"
git diff --stat refs/upstream/vNOVA HEAD     # só marca, arquivos de marca e item 3
git grep -n -i deskcomm -- app components lib workers hooks   # só o que branding.test.ts aceita
```

O commit fecha o merge (o `MERGE_HEAD` tem de ser o commit da tag, não o objeto da tag:
`git rev-parse refs/upstream/vNOVA^{commit} > .git/MERGE_HEAD`). Assim a próxima
sincronização tem base comum com o original.
