# Bárbara Cordeiro — Advocacia Criminal

Site institucional desenvolvido em Next.js, TypeScript e React, com foco em performance, SEO, responsividade e acessibilidade.

## Recursos

- Home institucional responsiva com a identidade visual preto e dourado.
- Páginas Sobre, Áreas de Atuação, Blog e Contato.
- Blog com URLs amigáveis, metadata e dados estruturados.
- Painel administrativo em `/admin` para conteúdo, SEO e CRUD de artigos.
- Persistência do conteúdo via GitHub Contents API.
- Sitemap, robots.txt, canonical, Open Graph e Schema.org.

## Variáveis de ambiente

Copie `.env.example` e configure `ADMIN_PASSWORD`, `ADMIN_SECRET`, `GITHUB_CMS_TOKEN`, `GITHUB_REPO_OWNER` e `GITHUB_REPO_NAME`.

## Desenvolvimento

```bash
npm install
npm run dev
```

Validação de produção:

```bash
npm run lint
npm run build
```
