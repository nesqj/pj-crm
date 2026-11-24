# Sincronizar o Umbu CRM com o DeskcommCRM

O Umbu CRM é o [DeskcommCRM](https://github.com/melgarafael/DeskcommCRM) com outra marca.
A regra de cada sincronização: **a árvore do Umbu CRM é a da tag do original, mais a marca
Umbu CRM, mais as correções próprias listadas abaixo — e nada além disso.** Tudo o que o
Umbu CRM tinha feito de diferente e que o original resolveu de outro jeito volta a ser como
no original.

## O que é próprio do Umbu CRM (e precisa sobreviver a cada sincronização)

1. **Trocas mecânicas de marca** — feitas por `scripts/marca-pjcrm.sh` (nomes,
   repositório, imagens `ghcr.io/nesqj/pjcrm{,-worker,-scheduler}`, contêineres,
   caminhos com `deskcomm`, a cor `#506d48` → `#37771a` nos arquivos simples, o
   `LICENSE` e os derivados: o selo das traduções e o `extensoes/catalogo.json`).
2. **Arquivos de marca desenhados à mão** — o script não os gera; voltam do Umbu CRM,
   juntando o que o original tiver mudado neles:
   - `lib/branding/desenho.ts`, `lib/branding/fruta.tsx` (só existe no Umbu CRM),
     `components/branding/MarcaDoProduto.tsx`, `app/icon.tsx`, `lib/branding/icone-do-app.tsx`,
     `lib/branding/regua-do-produto.ts`
   - `app/globals.css` (a rampa verde de `--color-accent-*` e `--color-accent-soft`, e o bloco
     `[data-casca="menu"]` do menu verde-escuro, no fim do arquivo)
   - `docs/brand/README.md`, `docs/brand/icone.png`, `docs/brand/logo-claro.png` e
     `docs/brand/logo-escuro.png` (os SVG, o og-card e a imagem social de `docs/brand/`
     e as capturas de `evidence/marca/` do original são apagados)
   - os testes de marca: `tests/unit/branding.test.ts`, `branding-contraste.test.ts`,
     `branding-rampa.test.ts`, `handoff-na-raiz-nao-volta.test.ts`,
     `marca-do-produto-nao-se-edita-no-codigo.test.ts`, `marca-do-produto.test.tsx`
3. **Correções de segurança anti-SSRF** (commit `4f8f8a4`): redirecionamento da mídia do
   Zernio conferido salto a salto, com a credencial só no host original
   (`lib/channels/adapters/zernio.ts`), e IPv4-mapped em hexadecimal/por extenso em
   `lib/automation/outbound-ip.ts`, com os testes `tests/unit/channel-adapter-zernio.test.ts`
   e `tests/unit/outbound-ip.test.ts`. Quando o original trouxer correção equivalente,
   fique com a dele e tire esta linha.
4. **A conferência de isolamento do CI lê uma cópia guardada do `update.sh` da v1.63.0**
   (`tests/fixtures/update-sh/v1.63.0.sh`, igual ao original byte a byte, e a função
   `update_sh_da` de `scripts/conferir-isolamento-do-kit.sh`). A tag v1.63.0 só existe no
   DeskcommCRM; com a cópia, o check obrigatório `invariants` não depende do repositório
   do original. O script de marca não mexe na cópia e a devolve se a sincronização a apagar.
5. **Os README são do Umbu CRM** (`README.md`, `README.en.md`, `README.es.md`, com a marca
   `<!-- readme-pjcrm -->`): não acompanham o original. O script devolve a versão do Umbu CRM
   quando a sincronização traz a do original, e apaga o `.all-contributorsrc`, que só servia
   à tabela de contribuidores do README do original.
6. **`CHANGELOG.md`**: as seções 2.x do Umbu CRM no topo, acima do histórico 1.x do original.

## O banco

As migrations e o `supabase/baseline.sql` entram como no original, só com a marca. O
script troca apenas nomes de configuração de sessão (`deskcomm.*` → `pjcrm.*`), o
prefixo `deskcommapp` do id de evento do Google e texto de comentário — exatamente o
que já foi trocado no baseline que as instalações aplicaram. Nenhuma tabela, função ou
coluna tem a marca no nome. Confira a cada sincronização:

```bash
git diff -U0 --word-diff=porcelain refs/upstream/vNOVA HEAD -- '*.sql' | grep -E '^[-+]' | sort | uniq -c
```

## A versão é sua

A sincronização traz arquivos, nunca número de versão. O original numera as versões dele
(1.124.0, 1.125.0…), e essas seções entram no `CHANGELOG.md` abaixo das do Umbu CRM, só como
histórico. O número do Umbu CRM é você quem escolhe: escreva a seção nova no topo do
`CHANGELOG.md` com o número que quiser (no formato `## [X.Y.Z] — AAAA-MM-DD`, que o painel
de atualização lê) e, depois do merge, publique a Release `vX.Y.Z` no GitHub. Mesclar um PR
não cria versão: o `release.yml` só corta versão por um PR de release aberto pelo robô
dele, e o Umbu CRM publica as Releases à mão.

## Passo a passo

`vANTERIOR` é a tag do original da última sincronização (hoje `v1.123.0`) e `vNOVA` é a
nova. A ideia: a diferença entre "o original da última vez, com a marca" e o `main` do
Umbu CRM é tudo o que é do Umbu CRM. Ela é recalculada e reaplicada por cima do original novo.

```bash
git fetch https://github.com/melgarafael/DeskcommCRM.git \
  refs/tags/vANTERIOR:refs/upstream/vANTERIOR refs/tags/vNOVA:refs/upstream/vNOVA
git checkout -b sync/deskcomm-NOVA origin/main
pnpm install
```

1. **A referência (o original da última vez, com a marca):**

```bash
git worktree add --detach ../ref refs/upstream/vANTERIOR
git show HEAD:scripts/marca-pjcrm.sh > ../ref/scripts/marca-pjcrm.sh
ln -s "$PWD/node_modules" ../ref/node_modules
(cd ../ref && bash scripts/marca-pjcrm.sh && rm node_modules && git add -A)
REF=$(git -C ../ref write-tree)
```

2. **O original novo, com a marca:**

```bash
git merge --no-commit --no-ff refs/upstream/vNOVA
git rev-parse refs/upstream/vNOVA^{commit} > .git/MERGE_HEAD
git read-tree -u --reset refs/upstream/vNOVA^{tree}
git clean -fd
git checkout HEAD -- scripts/marca-pjcrm.sh
bash scripts/marca-pjcrm.sh
git add -A
```

3. **O que é do Umbu CRM, reaplicado por cima:**

```bash
git diff "$REF" HEAD -- . ':!scripts/marca-pjcrm.sh' ':!README*.md' \
  ':!docs/sincronizar-com-o-original.md' ':!docs/brand/*.png' ':!docs/brand/*.svg' \
  ':!docs/brand/og-*' ':!evidence/marca/*' ':!.all-contributorsrc' \
  ':!tests/fixtures/update-sh/*' \
  | git apply -3 --index
```

Os arquivos excluídos do `git diff` são os que o script já cuidou no passo 2 (README,
logos, roteiro, cópia do update.sh antigo, marca antiga do original). Testado em 22/11/2026 refazendo a própria
sincronização da 1.123.0: o resultado saiu idêntico ao `main`.

Onde o original mexeu no mesmo trecho que o Umbu CRM, o `git apply` deixa conflito para
resolver à mão — no último sync foi só `components/branding/MarcaDoProduto.tsx`. O
`CHANGELOG.md` também deve conflitar: mantenha as seções 2.x do Umbu CRM acima das seções 1.x
novas do original. Se o
original passou a trazer uma das correções do item 3, fique com a dele.

4. **A seção nova do `CHANGELOG.md`**, com o número que você escolheu (ver acima).

5. **Conferir e fechar:**

```bash
bash scripts/marca-pjcrm.sh --check          # "nada a trocar"
git diff --stat refs/upstream/vNOVA HEAD     # só marca e o que é do Umbu CRM
git grep -n -i deskcomm -- app components lib workers hooks   # só o que branding.test.ts aceita
pnpm typecheck && pnpm test:unit && pnpm test:shell && pnpm test:db
git commit                                   # fecha o merge: o original novo vira base comum
git worktree remove ../ref
```
