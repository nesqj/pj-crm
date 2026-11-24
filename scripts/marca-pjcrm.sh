#!/usr/bin/env bash
# marca-pjcrm.sh — aplica a marca Umbu CRM sobre uma árvore do DeskcommCRM.
#
# O Umbu CRM é o DeskcommCRM (github.com/melgarafael/DeskcommCRM) com outra
# marca. A cada sincronização (merge de uma tag nova do original), a árvore que
# chega fala "DeskcommCRM"; este script reproduz as trocas MECÂNICAS do commit
# de rebrand 99d9b72 para que ela volte a falar "Umbu CRM". O roteiro completo da
# sincronização está em docs/sincronizar-com-o-original.md.
#
# O que ele troca:
#   - caminhos com "deskcomm" no nome (skills .agents/skills/deskcomm-* etc.);
#   - DeskcommCRM → "Umbu CRM" no texto e "pj-crm" em caminho/repositório;
#     deskcommcrm/deskcomm → pjcrm; DESKCOMM → PJCRM; X-Deskcomm- → X-PJCRM-;
#   - melgarafael/DeskcommCRM → nesqj/pj-crm; imagens do GHCR → nesqj/pjcrm*;
#     contêineres deskcommcrm-* → pjcrm-*;
#   - a cor da marca (#506d48 → #37771a), só nos arquivos da lista
#     ARQUIVOS_DA_COR; a rampa e a paleta vivem nos arquivos de marca abaixo;
#   - o LICENSE: mantém o copyright do original e acrescenta o do fork;
#   - os derivados que dependem dos bytes trocados: o selo das traduções de
#     docs/white-label.md e o sha256 de extensoes/catalogo.json;
#   - nos testes de shell do kit, a pasta de instalação /…/DeskcommCRM vira
#     /…/pjcrm, para o nome de projeto do compose continuar o esperado.
#
# Ele NÃO define versão: o número do Umbu CRM é decidido pelo dono, no CHANGELOG
# e na Release (ver o roteiro).
#
# O que ele preserva de propósito (aponta para o original ou para terceiros):
#   - links de commits, comparações, PRs, issues e releases do original (são
#     histórico de lá: o número não existe aqui);
#   - forks de terceiros (github.com/<outro>/DeskcommCRM) e o .mailmap;
#   - os domínios do original (*.deskcomm.com.br, admin.deskcomm.com);
#   - "DeskcommCRM" seguido de número de versão ou de "o projeto de origem"
#     (o CHANGELOG fala do original assim) e qualquer linha marcada com
#     marca-pjcrm:preservar (em comentário: <!-- … --> ou # …).
#
# O que é do Umbu CRM e não do original (passo 0):
#   - os README.md, README.en.md e README.es.md são escritos para o Umbu CRM (têm a
#     marca <!-- readme-pjcrm -->): se a sincronização trouxe o README do original,
#     o script devolve o do Umbu CRM que está no HEAD;
#   - arquivos que só o Umbu CRM tem (lista PROPRIOS) voltam do HEAD quando faltam;
#   - arquivos do original que o Umbu CRM não usa (lista NAO_USADOS) são apagados.
#
# O que ele NÃO faz (são arquivos de marca e voltam do Umbu CRM, não do original):
#   lib/branding/desenho.ts, components/branding/MarcaDoProduto.tsx,
#   app/icon.tsx, lib/branding/icone-do-app.tsx, docs/brand/* e os testes de
#   marca (tests/unit/branding*.test.ts e afins). Ver o roteiro.
#
# Idempotente: rodar duas vezes dá o mesmo resultado que rodar uma.
#
# Uso (na raiz do repositório):
#   bash scripts/marca-pjcrm.sh           # aplica
#   bash scripts/marca-pjcrm.sh --check   # só lista o que mudaria (sai 1 se algo)
set -euo pipefail

raiz="$(git rev-parse --show-toplevel)"
cd "$raiz"

modo="aplicar"
case "${1:-}" in
  "") ;;
  --check) modo="checar" ;;
  *) echo "uso: bash scripts/marca-pjcrm.sh [--check]" >&2; exit 2 ;;
esac

# Arquivos que as trocas de texto nunca reescrevem: este script, o roteiro da
# sincronização (fala do original de propósito), o LICENSE (tratado no passo 3) e
# as cópias de update.sh antigos que a conferência de isolamento lê (ficam iguais
# ao original, byte a byte).
ignorados_re='^(scripts/marca-pjcrm\.sh|docs/sincronizar-com-o-original\.md|LICENSE|tests/fixtures/update-sh/.*)$'

# Os únicos arquivos em que a cor da marca é trocada. Fora deles o hex sálvia
# aparece como histórico (docs de design, evidências, curso) e fica como está.
ARQUIVOS_DA_COR=(
  .env.example
  hostgator-setup-kit/marca-emails.sh
  hostgator-setup-kit/test-validators.sh
  supabase/templates/confirmation.html
  supabase/templates/recovery.html
)

read -r -d '' TROCAS <<'PERL' || true
# ---- trechos preservados (voltam intactos no fim) ----
my @g; my $p = sub { push @g, $_[0]; "\x01" . $#g . "\x02" };
my $fim = qr{[^\s)\]"'`>|,]*};
s{(?:https?://)?(?:[\w-]+\.)*deskcomm\.com\.br$fim}{$p->($&)}ge;
s{(?:https?://)?www-deskcomm-com-br\.translate\.goog$fim}{$p->($&)}ge;
s{\badmin\.deskcomm\.com\b}{$p->($&)}ge;
s{github\.com/melgarafael/DeskcommCRM/(?:commits?|compare|pull/\d|issues/\d|releases/tag)$fim}{$p->($&)}ge;
s{github\.com/(?:jmpo|oianmaxdev|webtecnica|saraivabr)/DeskcommCRM$fim}{$p->($&)}ge;
s{github\.com/(?!melgarafael/|nesqj/)[\w.-]+/DeskcommCRM/(?:pull|commit|issues)/$fim}{$p->($&)}ge;
if ($ARGV =~ m{(?:^|/)\.mailmap$}) { s{(?<![\w/])\@?melgarafael(?!/)}{$p->($&)}ge; }
s{^.*marca-pjcrm:preservar.*$}{$p->($&)}gme;
# O nome do projeto de origem quando o texto fala DELE ("do DeskcommCRM, o projeto
# de origem", "o DeskcommCRM 1.123.0") e a regex que aceita os dois domínios.
s{DeskcommCRM(?=,? (?:o projeto de origem|\d+\.\d+))}{$p->($&)}ge;
s{\(\?:pjcrm\|deskcomm\)}{$p->($&)}ge;
# ---- trocas ----
# Testes de shell do kit: uma pasta de instalação /…/DeskcommCRM tem como projeto
# do compose o nome em minúsculas (deskcommcrm → pjcrm). A pasta vira /…/pjcrm para
# o esperado continuar sendo o que o compose calcula dela.
if ($ARGV =~ m{(?:^|/)(?:tests/shell/[^/]+\.test\.sh|hostgator-setup-kit/test-[^/]+\.sh)$}) {
  s{((?<![\w.-])[/\$~][\w.\$~/{}-]*/)DeskcommCRM(?![\w.-])}{ my ($t, $c) = ($&, $1); $c =~ m{(?:github\.com/[^/]*/|melgarafael/)$} ? $t : "${c}pjcrm" }ge;
}
s{(?<=ghcr\.io/)melgarafael/deskcommcrm|(?<=ghcr\.io/v2/)melgarafael/deskcommcrm|(?<=repository:)melgarafael/deskcommcrm}{nesqj/pjcrm}g;
s{melgarafael/deskcommcrm}{nesqj/pj-crm}g;
s{melgarafael/DeskcommCRM}{nesqj/pj-crm}g;
s{melgarafael}{nesqj}g;
s{X-Deskcomm-}{X-PJCRM-}g;
s{Deskcomm CRM}{Umbu CRM}g;
s{DeskComm}{Umbu CRM}g;
s{(?<=APP_NAME )DeskcommCRM\b}{"Umbu CRM"}g;
s{deskcomm-crm}{pj-crm}g;
s{(?<=[/\\])DeskcommCRM|DeskcommCRM(?=\.git\b|/|-[\w`*])|(?<=\bcd )DeskcommCRM|(?<="projectName": ")DeskcommCRM}{pj-crm}g;
s{DeskcommCRM}{Umbu CRM}g;
s{Deskcomm}{Umbu CRM}g;
s{deskcommcrm}{pjcrm}g;
s{deskcomm}{pjcrm}g;
s{DESKCOMMCRM}{PJCRM}g;
s{DESKCOMM}{PJCRM}g;
# O teste do nome de projeto do compose (tests do kit) mede a REGRA, não a marca:
# trocado o nome da pasta, o esperado acompanha o que o compose calcula dela.
if ($ARGV =~ m{(?:^|/)hostgator-setup-kit/test-validators\.sh$}) {
  s{^np_ok /root/pjcrm\.crm pjcrm$}{np_ok /root/pjcrm.crm pjcrmcrm}m;
}
s{\x01(\d+)\x02}{$g[$1]}g;
PERL

read -r -d '' COR <<'PERL' || true
# A cor da marca: sálvia #506d48 (DeskcommCRM) → verde #37771a (Umbu CRM).
s{#506d48\b}{#37771a}g; s{#506D48\b}{#37771A}g;
PERL

mudou=0
reportar() { printf '%s\n' "$1"; mudou=1; }

# ---------------------------------------------------------------- 0. arquivos do Umbu CRM
# Os README do Umbu CRM não vêm do original: se o que está no disco não é o do
# Umbu CRM (sem a marca readme-pjcrm) e o HEAD tem o do Umbu CRM, devolve o do HEAD.
for f in README.md README.en.md README.es.md; do
  [ -f "$f" ] && grep -q 'readme-pjcrm' "$f" && continue
  git cat-file -e "HEAD:$f" 2>/dev/null || continue
  git show "HEAD:$f" | grep -q 'readme-pjcrm' || continue
  if [ "$modo" = "checar" ]; then reportar "readme do original: $f"; continue; fi
  git show "HEAD:$f" > "$f"
  git add -- "$f"
  mudou=1
done

# Arquivos que só o Umbu CRM tem: a árvore do original não os traz. Se sumiram,
# voltam do HEAD (o commit do Umbu CRM de onde a sincronização partiu).
PROPRIOS=(
  docs/sincronizar-com-o-original.md
  tests/fixtures/update-sh/v1.63.0.sh
  docs/brand/icone.png
  docs/brand/logo-claro.png
  docs/brand/logo-escuro.png
)
for f in "${PROPRIOS[@]}"; do
  [ -e "$f" ] && continue
  git cat-file -e "HEAD:$f" 2>/dev/null || continue
  if [ "$modo" = "checar" ]; then reportar "proprio ausente: $f"; continue; fi
  mkdir -p "$(dirname "$f")"
  git show "HEAD:$f" > "$f"
  git add -- "$f"
  mudou=1
done

# ---------------------------------------------------------------- 1. caminhos
while IFS= read -r -d '' arq; do
  novo="$(printf '%s' "$arq" | sed -E 's/deskcommcrm/pjcrm/g; s/deskcomm/pjcrm/g')"
  [ "$novo" = "$arq" ] && continue
  if [ "$modo" = "checar" ]; then reportar "renomear: $arq -> $novo"; continue; fi
  mkdir -p "$(dirname "$novo")"
  git mv -f "$arq" "$novo"
  mudou=1
done < <(git ls-files -z | grep -zE 'deskcomm' || true)

# Arquivos do original que o Umbu CRM não usa (nomes já com a marca trocada): a
# tabela de contribuidores do README do original e a marca antiga.
NAO_USADOS=(
  .all-contributorsrc
  docs/brand/pjcrm-icon.svg
  docs/brand/pjcrm-logo.svg
  docs/brand/pjcrm-logo-dark.svg
  docs/brand/og-card.html
  docs/brand/og-social-preview.png
)
mapfile -t marca_antiga < <(git ls-files -- 'evidence/marca/*')
for f in "${NAO_USADOS[@]}" "${marca_antiga[@]}"; do
  git ls-files --error-unmatch -- "$f" >/dev/null 2>&1 || continue
  if [ "$modo" = "checar" ]; then reportar "nao usado: $f"; continue; fi
  git rm -q -f -- "$f"
  mudou=1
done

# O selo das traduções só é refeito se estava em dia ANTES das trocas: um selo
# já defasado no original continua defasado (re-selar esconderia tradução velha).
selo_em_dia=0
if [ "$modo" = "aplicar" ] && [ -d node_modules ]; then
  pnpm exec tsx scripts/selar-traducao.ts >/dev/null 2>&1 && selo_em_dia=1
fi

# ---------------------------------------------------------------- 2. conteúdo
aplicar_perl() {  # aplicar_perl <programa> <arquivo>...
  local prog="$1"; shift
  local a
  for a in "$@"; do
    [ -f "$a" ] || continue
    if [ "$modo" = "checar" ]; then
      diff -q <(perl -0777 -pe "$prog" "$a") "$a" >/dev/null || reportar "conteudo: $a"
    fi
  done
  if [ "$modo" = "aplicar" ] && [ "$#" -gt 0 ]; then
    printf '%s\0' "$@" | xargs -0 perl -0777 -pi -e "$prog"
    mudou=1
  fi
}

mapfile -d '' achados < <(git grep -z -I -l -i -E 'deskcomm|melgarafael' -- . || true)
alvos=()
for a in "${achados[@]}"; do
  [[ "$a" =~ $ignorados_re ]] && continue
  alvos+=("$a")
done
aplicar_perl "$TROCAS" "${alvos[@]}"
aplicar_perl "$COR" "${ARQUIVOS_DA_COR[@]}"

# ---------------------------------------------------------------- 3. LICENSE
if [ -f LICENSE ] && ! grep -q 'nesqj (Umbu CRM, fork)' LICENSE; then
  if [ "$modo" = "checar" ]; then
    reportar "conteudo: LICENSE"
  else
    perl -0777 -pi -e 's{^Copyright \(c\) (\d{4}) Rafael Melgaço$}{Copyright (c) $1 Rafael Melgaço (DeskcommCRM, projeto original)\nCopyright (c) $1 nesqj (Umbu CRM, fork)}m' LICENSE
  fi
fi

# ---------------------------------------------------------------- 4. derivados
if [ "$modo" = "aplicar" ]; then
  if [ -d node_modules ]; then
    [ "$selo_em_dia" = 1 ] && pnpm exec tsx scripts/selar-traducao.ts --todas >/dev/null
    [ -f scripts/gerar-catalogo-de-extensoes.ts ] && pnpm exec tsx scripts/gerar-catalogo-de-extensoes.ts >/dev/null
  else
    echo "marca-pjcrm: sem node_modules — rode 'pnpm install' e depois:" >&2
    echo "  pnpm exec tsx scripts/selar-traducao.ts --todas   (se o selo estava em dia no original)" >&2
    echo "  pnpm exec tsx scripts/gerar-catalogo-de-extensoes.ts" >&2
  fi
  echo "marca-pjcrm: marca aplicada (${#alvos[@]} arquivo(s) com a marca original)"
  exit 0
fi

if [ "$mudou" = 0 ]; then echo "marca-pjcrm: nada a trocar"; exit 0; fi
exit 1
