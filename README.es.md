<!-- readme-pjcrm: este README é do PJ CRM; scripts/marca-pjcrm.sh o preserva na sincronização -->
<div align="center">

[🇧🇷 Português](README.md) · [🇺🇸 English](README.en.md) · 🇪🇸 Español

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/brand/logo-escuro.png">
  <img src="docs/brand/logo-claro.png" alt="PJ CRM" width="240">
</picture>

# PJ CRM

**CRM de ventas con agentes de IA para WhatsApp, de código abierto, en tu propio servidor.**

</div>

---

## Cómo funciona

PJ CRM reúne en una sola pantalla **WhatsApp**, el **embudo de ventas** y **agentes de IA**
que trabajan junto a tu equipo:

1. **El cliente escribe por WhatsApp.** El número se conecta por código QR o por el canal
   oficial de Meta, y la conversación aparece en la **Inbox**.
2. **El agente de IA atiende.** Responde con lo que le enseñaste (la base de conocimiento de
   tu empresa), califica al cliente, agenda citas y crea el negocio en el embudo.
3. **El equipo toma el control cuando hace falta.** El agente sabe cuándo pasar a una
   persona, y cualquier miembro del equipo puede entrar en la conversación en cualquier
   momento. Todo queda registrado.
4. **Nada muere en silencio.** Los seguimientos retoman la conversación que se enfrió, las
   automatizaciones mueven el negocio en el embudo y la Central avisa lo que necesita una
   decisión humana.
5. **Sigues los números.** Rendimiento del embudo, de cada agente y el costo de la IA.

Sirve para clínicas, inmobiliarias, tiendas, agencias, infoproductos y prestadores de
servicios: los nombres se ajustan al negocio (un lead puede ser *Paciente*, una venta *Pagado*).

Los datos quedan en **tu VPS**, con varias empresas separadas en la misma instalación y
protección de datos (LGPD) desde el origen. Sin mensualidad ni funciones bloqueadas.

---

## Instalar en una VPS

Necesitas:

| Ítem | Detalle |
|---|---|
| **VPS con Docker** | 4 GB de RAM recomendados. x86_64 o ARM64 |
| **Dominio** | Un registro **A** que apunte a la IP de la VPS (ej.: `crm.tuempresa.com`) |
| **Base de datos** | Cuenta gratis en [supabase.com](https://supabase.com), o Supabase en la propia VPS |
| **IA** | Una clave de OpenRouter, Anthropic u OpenAI |
| **WhatsApp** | Tu número, conectado por código QR en el primer acceso |

Entra en la VPS (`ssh root@TU_IP`) y ejecuta:

```bash
git clone https://github.com/nesqj/pj-crm.git
cd pj-crm
bash hostgator-setup-kit/install.sh
```

El instalador pregunta solo lo tuyo (dominio, claves, contraseña del admin), valida cada
respuesta, prepara la base de datos, crea el primer admin y levanta todo con HTTPS. No se
compila nada: las imágenes vienen listas. Si la VPS ya tiene su propio proxy (Hostinger,
Coolify, Dokploy), lo detecta.

Después abre `https://<tu-dominio>`, entra con el admin y conecta WhatsApp en el onboarding.
Si no elegiste contraseña, la inicial está en `.env`, en `OWNER_PASSWORD`.

Detalles y problemas comunes: [`hostgator-setup-kit/README.md`](hostgator-setup-kit/README.md).

### ¿Prefieres que una IA lo instale por ti?

El repositorio trae guías que Claude Code, Codex, Cursor, OpenCode y Antigravity cargan solos:
instalar, montar un cliente por nicho, analizar métricas, afinar el prompt del agente y
contribuir. Para tenerlas en cualquier carpeta, ejecuta una vez:

```bash
curl -fsSL https://raw.githubusercontent.com/nesqj/pj-crm/main/scripts/instalar-guias.sh | bash
```

Después, en una sesión nueva, di *"quero instalar o CRM na minha VPS"*. Para llamar una guía por
su nombre: `/pjcrm-instalar` en Claude Code, Cursor y Antigravity; `$pjcrm-instalar` en Codex; en
OpenCode, pídela por su nombre.

Las guías **no** se actualizan solas: ejecutar el comando otra vez trae la versión nueva. Para deshacer:

```bash
curl -fsSL https://raw.githubusercontent.com/nesqj/pj-crm/main/scripts/instalar-guias.sh | bash -s -- --remover
```

Con el repositorio clonado, las guías ya vienen dentro (`.agents/skills/`). Si ejecutaste el
comando igual, en Claude Code la guía instalada vale más que la del clon, hasta que lo ejecutes de nuevo o deshagas.

---

## Actualizar

**Desde la pantalla:** cuando sale una versión nueva, el menú lateral muestra **"Nueva
versión"** al dueño del servidor. En **Configuración › Actualización** ves lo que cambia y
haces clic en actualizar: el sistema respalda la base de datos, cambia la versión y confirma
que volvió a funcionar. Si la versión nueva falla, vuelve sola a la anterior.

**Desde la terminal:**

```bash
cd /ruta/al/pj-crm
bash hostgator-setup-kit/update.sh
```

Antes de actualizar, lee la sección de la versión en [`CHANGELOG.md`](CHANGELOG.md): lo que
requiere acción tuya aparece en **⚠️ Requer atenção**.

---

## Desarrollo

Para trabajar en el código (para usar el CRM, usa el instalador de arriba):

```bash
git clone https://github.com/nesqj/pj-crm.git
cd pj-crm
nvm use                     # Node 22
pnpm install
cp .env.example .env.local  # guía completa en docs/SETUP.md

# El schema es baseline.sql (el mismo que aplica el instalador), no las migrations.
# En un proyecto Supabase nuevo, habilita antes las extensiones que usa el schema.
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -c \
  'create extension if not exists vector with schema public;
   create extension if not exists citext with schema public;
   create extension if not exists pg_trgm with schema public;'

psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/baseline.sql

pnpm dev                    # http://localhost:3000
```

Pruebas: `pnpm typecheck`, `pnpm lint`, `pnpm test:unit` y `pnpm test:db`.

Tecnología: Next.js, React, TypeScript, Supabase (Postgres con RLS), WAHA para WhatsApp y
Vercel AI SDK para la IA. Arquitectura en [`ARCHITECTURE.md`](ARCHITECTURE.md), integraciones
en [`docs/SETUP.md`](docs/SETUP.md) y el resto de la documentación en
[`docs/index.md`](docs/index.md) (en portugués).

---

## Problemas

¿Encontraste un error? Abre un issue en
[github.com/nesqj/pj-crm/issues](https://github.com/nesqj/pj-crm/issues), con la versión
instalada y lo que pasó. Fallo de seguridad: consulta [`SECURITY.md`](SECURITY.md).
