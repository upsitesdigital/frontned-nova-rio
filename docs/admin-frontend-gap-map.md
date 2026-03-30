# Mapeamento de Lacunas - Admin Frontend vs Backend

Data: 2026-03-30

## Resumo de cobertura

- Dashboard: completo no front
- Clientes: completo no front
- Funcionarios: parcial (faltam criacao e alguns fluxos)
- Agendamentos admin: parcial (faltam acoes de ciclo de vida)
- Servicos: nao implementado no front admin
- Pacotes: nao implementado no front admin
- Feriados: nao implementado no front admin
- Unidades: nao implementado no front admin
- Pagamentos admin: nao implementado no front admin
- Relatorios admin: nao implementado no front admin
- Admin users: nao implementado no front admin

## Mapa por dominio

## Dashboard

- Backend pronto:
  - GET /admin/dashboard/today-appointments-count
  - GET /admin/dashboard/active-clients-count
  - GET /admin/dashboard/pending-appointments-count
  - GET /admin/dashboard/today-agenda
- Frontend pronto:
  - app admin principal
- Falta no front:
  - Sem lacunas relevantes no momento
- Referencias:
  - backend-nova-rio/src/dashboard/admin-dashboard.controller.ts
  - frontned-nova-rio/src/app/admin/page.tsx
  - frontned-nova-rio/src/api/admin-dashboard-api.ts

## Agendamentos Admin

- Backend pronto:
  - POST /admin/appointments
  - GET /admin/appointments
  - GET /admin/appointments/:id
  - PATCH /admin/appointments/:id
  - POST /admin/appointments/:id/reschedule
  - PATCH /admin/appointments/:id/cancel
  - PATCH /admin/appointments/:id/complete
- Frontend pronto:
  - Listagem e criacao
- Falta no front:
  - Editar agendamento
  - Remarcar agendamento
  - Cancelar agendamento
  - Marcar como concluido
- Referencias:
  - backend-nova-rio/src/appointments/admin-appointments.controller.ts
  - frontned-nova-rio/src/api/admin-appointments-api.ts
  - frontned-nova-rio/src/stores/admin-appointments-store.ts
  - frontned-nova-rio/src/app/admin/agendamentos/page.tsx

## Clientes

- Backend pronto:
  - GET /clients
  - GET /clients/:id
  - PATCH /clients/:id/approve
  - PATCH /clients/:id/reject
- Frontend pronto:
  - Listagem
  - Aprovacao
  - Rejeicao
- Falta no front:
  - Sem lacunas criticas
- Referencias:
  - backend-nova-rio/src/clients/clients.controller.ts
  - frontned-nova-rio/src/api/admin-clients-api.ts
  - frontned-nova-rio/src/app/admin/clientes/page.tsx

## Funcionarios

- Backend pronto:
  - POST /employees
  - GET /employees
  - GET /employees/:id
  - PATCH /employees/:id
  - DELETE /employees/:id
- Frontend pronto:
  - Listagem
  - Edicao
- Falta no front:
  - Criacao de funcionario
  - Fluxos de agenda/ocupacao completos na tela de detalhe
- Referencias:
  - backend-nova-rio/src/employees/employees.controller.ts
  - frontned-nova-rio/src/api/admin-employees-api.ts
  - frontned-nova-rio/src/app/admin/funcionarios/page.tsx
  - frontned-nova-rio/src/app/admin/funcionarios/[id]/page.tsx

## Servicos

- Backend pronto:
  - CRUD completo em /services
- Frontend pronto:
  - Sem painel admin dedicado
- Falta no front:
  - API admin de servicos
  - Store/use-cases
  - Tela admin de servicos
- Referencias:
  - backend-nova-rio/src/services/services.controller.ts

## Pacotes

- Backend pronto:
  - CRUD + reativacao em /packages
- Frontend pronto:
  - Sem painel admin dedicado
- Falta no front:
  - API admin de pacotes
  - Store/use-cases
  - Tela admin de pacotes
- Referencias:
  - backend-nova-rio/src/packages/packages.controller.ts

## Feriados

- Backend pronto:
  - CRUD + sync em /holidays
- Frontend pronto:
  - Sem painel admin dedicado
- Falta no front:
  - API admin de feriados
  - Store/use-cases
  - Tela admin de feriados
- Referencias:
  - backend-nova-rio/src/holidays/holidays.controller.ts

## Unidades

- Backend pronto:
  - CRUD + validate-coverage em /units
- Frontend pronto:
  - Uso parcial para selects
- Falta no front:
  - Painel admin completo de unidades
- Referencias:
  - backend-nova-rio/src/units/units.controller.ts

## Pagamentos Admin

- Backend pronto:
  - GET /admin/payments
  - GET /admin/payments/:id
  - PATCH /admin/payments/:id/approve
  - DELETE /admin/payments/:id
- Frontend pronto:
  - Sem painel admin dedicado
- Falta no front:
  - API admin pagamentos
  - Store/use-cases
  - Tela admin pagamentos
- Referencias:
  - backend-nova-rio/src/payments/admin-payments.controller.ts

## Relatorios

- Backend pronto:
  - GET /admin/reports/sales-summary
  - GET /admin/reports/active-clients
  - GET /admin/reports/hours-by-service
  - GET /admin/reports/transactions
  - GET /admin/reports/export
- Frontend pronto:
  - Sem painel admin dedicado
- Falta no front:
  - API admin relatorios
  - Store/use-cases
  - Tela de relatorios com filtros e export
- Referencias:
  - backend-nova-rio/src/reports/admin-reports.controller.ts

## Admin Users

- Backend pronto:
  - CRUD em /admin-users
- Frontend pronto:
  - Sem painel admin dedicado
- Falta no front:
  - API admin users
  - Store/use-cases
  - Tela admin users
- Referencias:
  - backend-nova-rio/src/admin-users/admin-users.controller.ts

## Prioridade recomendada (ordem)

1. Completar Agendamentos Admin (editar, remarcar, cancelar, concluir)
2. Completar Funcionarios (criar + agenda)
3. Servicos
4. Pacotes
5. Unidades
6. Relatorios
7. Pagamentos admin
8. Feriados
9. Admin users

## Proximo item para implementar

Recomendacao: Agendamentos Admin - acoes de ciclo de vida.

Motivo:
- Ja existe base no front (lista e criacao).
- Backend esta completo para todas as acoes.
- Alto impacto operacional para o time admin.
- Menor tempo para entregar valor real comparado a construir modulo novo do zero.

Escopo inicial sugerido:
- Adicionar no front os endpoints:
  - PATCH /admin/appointments/:id
  - POST /admin/appointments/:id/reschedule
  - PATCH /admin/appointments/:id/cancel
  - PATCH /admin/appointments/:id/complete
- Criar use-cases e acoes de UI na tabela de agendamentos.
