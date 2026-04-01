# Backlog de Implementacao Frontend (Gap vs Backend)

Data: 2026-03-31
Status: backend considerado pronto; este backlog cobre o que falta no frontend.

## Objetivo

Consolidar tudo que ainda precisa ser implementado no frontend para cobrir 100% das capacidades ja expostas no backend.

## Como usar este backlog com Figma

Para cada item abaixo:
1. Voce me envia o link do Figma (node) da tela.
2. Eu implemento no frontend com MCP (layout + integracao).
3. Marcamos o item como concluido.

---

## P0 - Criticos de contrato e fluxo

### 1) Fluxo de pagamento do cliente (checkout real)

- Status atual:
  - Front cria agendamento via endpoint publico em vez de executar fluxo de pagamento completo.
- Falta implementar:
  - Integrar checkout com endpoints de pagamentos do backend (criacao e acompanhamento do status).
  - Suportar estados de pagamento (pending, approved, cancelled) no fluxo da UI.
  - Tratar retorno de pix/cartao com UX completa.
- Evidencias:
  - Front: `src/use-cases/submit-payment.ts`
  - Front: `src/api/appointments-api.ts`
  - Back: `backend-nova-rio/src/payments/client-payments.controller.ts`
- Figma pendente:
  - [ ] Link da tela de checkout final
  - [ ] Link da tela de status de pagamento

### 2) Disponibilidade de horarios (time-slots) - validar contrato final

- Status atual:
  - Front chama `/scheduling/time-slots`.
  - Este endpoint nao aparece claramente no backend atual mapeado pelos controllers.
- Falta implementar:
  - Definir endpoint definitivo com backend (ou ajustar frontend para rota correta).
  - Fechar UX de erro/sem vagas/loading por data.
- Evidencias:
  - Front: `src/api/scheduling-api.ts`
  - Back (revisar): `backend-nova-rio/src/**` (nao encontrado controller `scheduling` na ultima varredura)
- Figma pendente:
  - [ ] Link da tela/estado de horario indisponivel

---

## P1 - Modulos Admin sem tela (backend pronto)

### 3) Admin Relatorios

- Backend pronto:
  - `GET /admin/reports/sales-summary`
  - `GET /admin/reports/active-clients`
  - `GET /admin/reports/hours-by-service`
  - `GET /admin/reports/transactions`
  - `GET /admin/reports/export`
- Falta no frontend:
  - Tela principal de relatorios
  - Filtros por periodo/status/unidade
  - Exportacao CSV/XLS
  - Camada `api` + `store` + `use-cases`
- Evidencia backend:
  - `backend-nova-rio/src/reports/admin-reports.controller.ts`
- Figma pendente:
  - [ ] Link tela relatorios

### 4) Admin Pagamentos

- Backend pronto:
  - `GET /admin/payments`
  - `GET /admin/payments/:id`
  - `PATCH /admin/payments/:id/approve`
  - `DELETE /admin/payments/:id`
- Falta no frontend:
  - Tela de listagem de pagamentos admin
  - Filtros e detalhes
  - Acoes de aprovar/cancelar
  - Camada `api` + `store` + `use-cases`
- Evidencia backend:
  - `backend-nova-rio/src/payments/admin-payments.controller.ts`
- Figma pendente:
  - [ ] Link tela pagamentos admin

### 5) Admin Users (usuarios administrativos)

- Backend pronto:
  - CRUD em `/admin-users`
- Falta no frontend:
  - Tela de listagem de admins
  - Criacao/edicao/remocao
  - Controle de papel/status
  - Camada `api` + `store` + `use-cases`
- Evidencia backend:
  - `backend-nova-rio/src/admin-users/admin-users.controller.ts`
- Figma pendente:
  - [ ] Link tela usuarios admin

### 6) Admin Servicos

- Backend pronto:
  - CRUD em `/services`
- Falta no frontend:
  - Tela de gestao de servicos
  - Formulario create/edit
  - Ativar/desativar
- Evidencia backend:
  - `backend-nova-rio/src/services/services.controller.ts`
- Figma pendente:
  - [ ] Link tela servicos

### 7) Admin Pacotes

- Backend pronto:
  - CRUD + reativacao em `/packages`
- Falta no frontend:
  - Tela de pacotes
  - Vinculo com servicos
  - Acoes de reativar/desativar
- Evidencia backend:
  - `backend-nova-rio/src/packages/packages.controller.ts`
- Figma pendente:
  - [ ] Link tela pacotes

### 8) Admin Feriados

- Backend pronto:
  - CRUD + sync em `/holidays`
- Falta no frontend:
  - Tela de calendario de feriados
  - Acoes de bloqueio/desbloqueio
  - Acao de sincronizacao
- Evidencia backend:
  - `backend-nova-rio/src/holidays/holidays.controller.ts`
- Figma pendente:
  - [ ] Link tela feriados

### 9) Admin Unidades

- Backend pronto:
  - CRUD em `/units` + `validate-coverage`
- Falta no frontend:
  - Tela completa de unidades
  - CRUD com geolocalizacao/raio
- Evidencia backend:
  - `backend-nova-rio/src/units/units.controller.ts`
- Figma pendente:
  - [ ] Link tela unidades

---

## P1 - Modulos Admin parciais (falta fechar ciclo)

### 10) Admin Agendamentos - fechar ciclo de vida

- Ja existe no frontend:
  - Listagem e criacao.
- Falta no frontend:
  - Editar agendamento
  - Remarcar agendamento
  - Cancelar agendamento
  - Marcar como concluido
- Endpoints backend prontos:
  - `PATCH /admin/appointments/:id`
  - `POST /admin/appointments/:id/reschedule`
  - `PATCH /admin/appointments/:id/cancel`
  - `PATCH /admin/appointments/:id/complete`
- Evidencias:
  - Front: `src/app/admin/agendamentos/page.tsx`
  - Front: `src/api/admin-appointments-api.ts`
  - Back: `backend-nova-rio/src/appointments/admin-appointments.controller.ts`
- Figma pendente:
  - [ ] Link modal/fluxo de editar
  - [ ] Link modal/fluxo de remarcar
  - [ ] Link modal/fluxo de cancelar/concluir

### 11) Admin Funcionarios - concluir CRUD e agenda

- Ja existe no frontend:
  - Listagem e edicao/detalhe parcial.
- Falta no frontend:
  - Criacao de funcionario
  - Exclusao de funcionario
  - Fluxo de agenda/ocupacao completo na tela de detalhe
- Endpoints backend prontos:
  - `POST /employees`
  - `DELETE /employees/:id`
- Evidencias:
  - Front: `src/app/admin/funcionarios/page.tsx`
  - Front: `src/api/admin-employees-api.ts`
  - Back: `backend-nova-rio/src/employees/employees.controller.ts`
- Figma pendente:
  - [ ] Link tela criar funcionario
  - [ ] Link estado detalhe/agenda

---

## P2 - Ajustes de navegacao e consistencia

### 12) Sidebar e atalhos admin

- Falta no frontend:
  - Habilitar itens de menu hoje desativados apos implementacao das telas.
  - Garantir roteamento e permissao consistentes em todos os modulos.
- Evidencia:
  - `src/design-system/composite/ds-admin-sidebar.tsx`

### 13) Padronizacao de mensagens de erro e estados vazios

- Falta no frontend:
  - Unificar tratamento de erro de API em todos os novos modulos.
  - Incluir estados de loading, empty e retry no padrao do design system.

---

## Ordem recomendada de execucao

1. Fluxo de pagamento do cliente (P0)
2. Validacao definitiva de endpoint de time-slots (P0)
3. Admin Agendamentos (acoes faltantes)
4. Admin Funcionarios (create/delete + agenda)
5. Admin Servicos
6. Admin Unidades
7. Admin Pacotes
8. Admin Pagamentos
9. Admin Relatorios
10. Admin Feriados
11. Admin Users
12. Ajustes finais de navegacao e padrao visual

---

## Checklist rapido para 100% de cobertura

- [ ] Todos os controllers do backend possuem tela/fluxo frontend correspondente
- [ ] Todos os endpoints usados no frontend estao consistentes com o contrato backend
- [ ] Sidebar admin sem itens desativados por falta de tela
- [ ] CRUD completo para modulos administrativos
- [ ] Fluxo de pagamento alinhado com backend (sem bypass via endpoint publico)
- [ ] Testes de fluxo critico (auth, agendamento, pagamento, aprovacoes)

---

## Observacao

Existe um arquivo de apoio com mapeamento de lacunas admin ja criado em:
- `docs/admin-frontend-gap-map.md`

Este backlog atual e a versao consolidada para implementacao por telas via Figma MCP.
