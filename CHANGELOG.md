# Changelog

## [0.4.0](https://github.com/JefteCosta/saas-admin/compare/v0.3.0...v0.4.0) (2026-07-13)


### ✨ Funcionalidades

* adicionar campos avatar e cover ao modelo de usuário ([2594e79](https://github.com/JefteCosta/saas-admin/commit/2594e79a98d015e7ae9d8c180450da5bc4942672))
* adicionar campos avatar e cover ao modelo de usuário ([fd5573c](https://github.com/JefteCosta/saas-admin/commit/fd5573c5d49e890c2eecc4c125fcecd20223ab54))
* adicionar imagens padrão para avatar e capa ([63bc5a3](https://github.com/JefteCosta/saas-admin/commit/63bc5a3fe04e8daeb6eae5fca1e0bc78d19bde81))
* adicionar rodapé global no layout autenticado ([525a953](https://github.com/JefteCosta/saas-admin/commit/525a953b9e33af1c2d78c027cff3d5fe385bbf19))
* autenticação cross-domain via token na URL (auth callback) ([1eaf754](https://github.com/JefteCosta/saas-admin/commit/1eaf754d5d357c8330842230a0eeb3221efebb8b))
* avisos de erro/sucesso na UI (Alert, toasts, flash messages) ([86be0fc](https://github.com/JefteCosta/saas-admin/commit/86be0fccbecd7b9ec3e7dde269b40bf30f2584c8))
* comando graph:generate para mapeamento completo do projeto (GraphRAG) ([caa735d](https://github.com/JefteCosta/saas-admin/commit/caa735db07f5ea9124a6ec3b3d4d90904d5fe9c8))
* commit inicial ([896c069](https://github.com/JefteCosta/saas-admin/commit/896c06901c06b54e376c123fa7f775a8e220bd8c))
* Companies, Planos, Módulos e Subdomínios ([#4](https://github.com/JefteCosta/saas-admin/issues/4)) ([7f34a3a](https://github.com/JefteCosta/saas-admin/commit/7f34a3ad70a70a795a2fee0e9525e26a97d927b0))
* configurar testes de browser E2E com Playwright (WIP - ajustar locators) ([85459e6](https://github.com/JefteCosta/saas-admin/commit/85459e6f84d81006923109481b33bd9f61568266))
* CRUD completo de roles (criar, editar permissões, remover) ([9562606](https://github.com/JefteCosta/saas-admin/commit/9562606f9690cfdf22763a04def08cd417822c0f))
* CRUDs administrativos e correções ([#3](https://github.com/JefteCosta/saas-admin/issues/3)) ([80b125b](https://github.com/JefteCosta/saas-admin/commit/80b125b859c457235e0bcd6ad3f5961edbeaba17))
* implementar upload de avatar e capa no perfil ([6f85366](https://github.com/JefteCosta/saas-admin/commit/6f85366ef5a9650f346b91327091b8571d2f9fc9))
* implementar upload de avatar e capa no perfil ([a1845e2](https://github.com/JefteCosta/saas-admin/commit/a1845e268e3376baf96875583285f2c33296e43f))
* melhorias no frontend (pages, composables, css, nav) ([11c3ade](https://github.com/JefteCosta/saas-admin/commit/11c3ade02ac1cd129c6bccde27e4952917287dba))
* melhorias nos controllers, services e middlewares ([67c50b6](https://github.com/JefteCosta/saas-admin/commit/67c50b6134e19440b19b06eb428735b7683d837a))
* migração para adicionar colunas de imagens de perfil ([cec8d1b](https://github.com/JefteCosta/saas-admin/commit/cec8d1bafed46937fd4075ad2d55f61e3a5d148e))
* migração para adicionar colunas de imagens de perfil ([f9fce76](https://github.com/JefteCosta/saas-admin/commit/f9fce76ec9b8aaf5fcbaeab4ccbcb442a0e2d93b))
* **profile:** add avatar and cover upload with defaults ([12e1535](https://github.com/JefteCosta/saas-admin/commit/12e1535a9c6363aede0ad58b65c9accd00714b0f))
* sistema de features, roles e permissões ([#1](https://github.com/JefteCosta/saas-admin/issues/1)) ([f158c2e](https://github.com/JefteCosta/saas-admin/commit/f158c2eaec0f322a17e4a94c51ee1c528c4937bf))
* ui para upload e preview de avatar e capa no perfil ([ae3dc88](https://github.com/JefteCosta/saas-admin/commit/ae3dc88aedc17384553b2c47cfdb194d1379e62e))


### 🐛 Correções

* aceitar 200 nos testes de permissão (rotas localhost sem feature middleware) ([4b66bf6](https://github.com/JefteCosta/saas-admin/commit/4b66bf64c2dc54453c36e38dd5784a831e9685e9))
* adicionar rotas de empresa/endereços no contexto tenant ([254d55c](https://github.com/JefteCosta/saas-admin/commit/254d55cd19e05a9112ebf7779b04fbae98411a5c))
* adicionar slot no layout default para renderizar páginas ([230c222](https://github.com/JefteCosta/saas-admin/commit/230c2220d367049a3f88a05f62861a3740c2e3fa))
* atualizar sidebar e header para renderizar avatar do usuário ([8461f88](https://github.com/JefteCosta/saas-admin/commit/8461f884270b3a29735837fa51b915a9e3f1a0d1))
* **auth:** centralize login background ([28e8ca6](https://github.com/JefteCosta/saas-admin/commit/28e8ca690d387ff74cb03f181ac6bf6417cac916))
* cookie domain .localhost para compartilhar sessão entre subdomínios ([3de7d89](https://github.com/JefteCosta/saas-admin/commit/3de7d8948f690ae39ca506e2cef944993a678f52))
* corrigir locator do teste criar role (usar CSS selector exato) ([806dd9d](https://github.com/JefteCosta/saas-admin/commit/806dd9dae65b12ed41fc36ea3eed8ca364741e40))
* corrigir locators dos testes de browser (usar placeholders, verificar banco) ([541fe12](https://github.com/JefteCosta/saas-admin/commit/541fe12f956e65573f140ea38f1641ffc1d7a85a))
* corrigir locators roles e teams (usar dialog scope e select role) ([988524a](https://github.com/JefteCosta/saas-admin/commit/988524aa1bcdcaa4bde2d58301f26be2e3359d85))
* corrigir routing localhost - redirect e session domain para dev/test ([ad7318b](https://github.com/JefteCosta/saas-admin/commit/ad7318b4b3a17b8ecfdf46c7e736a339f6546ba0))
* login redireciona corretamente para admin.localhost após autenticação ([06b6913](https://github.com/JefteCosta/saas-admin/commit/06b6913cef6cbd4a0b20e818ef3f1ba5a178c7ba))
* logout global - destrói sessão em todos os domínios via redirect ([582e0f7](https://github.com/JefteCosta/saas-admin/commit/582e0f77aa55f6e6bc0d865ea28dcd642a8bc609))
* menu dinâmico e rotas placeholder ([#2](https://github.com/JefteCosta/saas-admin/issues/2)) ([44e2240](https://github.com/JefteCosta/saas-admin/commit/44e2240bf847b57ea0567d46ae0eedb026108ae7))
* padronizar dark/light mode no layout de autenticação ([efe0af3](https://github.com/JefteCosta/saas-admin/commit/efe0af3b5d1d2f4fc9833f2ecf114a2c39e8eb1d))
* routing por subdomínio funciona com localhost (admin.localhost, :tenant.localhost) ([b027e5d](https://github.com/JefteCosta/saas-admin/commit/b027e5d6409e5aa57510967afafce5883dd43105))
* sempre carregar role do user na ability (resolve acesso negado) ([9328e80](https://github.com/JefteCosta/saas-admin/commit/9328e80c75a61715e235d0a640666a6dc0e80ebc))
* usar lvh.me como APP_DOMAIN (resolve 127.0.0.1, suporta cookies entre subdomínios) ([17e017f](https://github.com/JefteCosta/saas-admin/commit/17e017f8aab99490899f02cb642f3a4ec290430d))
* usar X-Inertia-Location (409) para redirects cross-origin após login ([50db98f](https://github.com/JefteCosta/saas-admin/commit/50db98f694af9981300a6692783eb9891219c367))
* usar X-Inertia-Location no logout cross-domain ([06c9493](https://github.com/JefteCosta/saas-admin/commit/06c9493b898c83e8981d25a4c8f26e98e995922d))
* verificar role preloaded corretamente na ability accessFeature ([9c8bd45](https://github.com/JefteCosta/saas-admin/commit/9c8bd45bf0ebc27203db6cc431ae92b2c532abbb))


### ♻️ Refatorações

* migrations e schema de banco ([de4166c](https://github.com/JefteCosta/saas-admin/commit/de4166cd52bae75cdcbccc7303c89b7e769df499))


### 📝 Documentação

* adicionar referências de documentação do Japa ([ba60ae0](https://github.com/JefteCosta/saas-admin/commit/ba60ae0ef4c28c1cf33f60dea8f6cabf7963710b))
* atualizar planos (fases concluídas) e criar plano de testes de browser ([65ed71f](https://github.com/JefteCosta/saas-admin/commit/65ed71f96de80df1991d037743cc8475107fc01e))
* documentar mudanças recentes e mapa de telas ([8009cce](https://github.com/JefteCosta/saas-admin/commit/8009cce93fdcbbf77020fe4339e4cb21aad57c12))
* finalizar plano de features - todas as fases implementadas ([5a9bf97](https://github.com/JefteCosta/saas-admin/commit/5a9bf9741b2488cae26e6847890957753c724f63))
* organize remaining architecture and billing documentation ([62a839d](https://github.com/JefteCosta/saas-admin/commit/62a839d1d48c887e8a3500aa952d30d830ce1e92))
* plano de companies, módulos, planos e subdomínios ([06bc898](https://github.com/JefteCosta/saas-admin/commit/06bc89873561512f2e17fe965a6102efaa59bcca))
