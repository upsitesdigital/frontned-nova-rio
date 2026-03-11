# Project Guidelines — Nova Rio Frontend

---

## 1. Design System First (REGRA DE OURO)

ANTES de implementar QUALQUER tela ou componente de UI, seguir OBRIGATORIAMENTE este fluxo:

### Passo a passo

1. **Listar componentes DS candidatos** — percorrer `src/design-system/` e identificar TODOS os componentes que podem corresponder à tela ou seção a ser implementada
2. **Ler cada componente** — abrir o arquivo e entender suas props, variantes, slots (`children`) e comportamento
3. **Compor a tela usando componentes DS** — montar a tela combinando componentes existentes
4. **Só usar HTML/Tailwind raw** para wrappers de layout (`div`, `section`, `main`) ou espaçamentos entre blocos
5. **Se o componente DS é parecido mas não exato** — estender com novas props opcionais, NUNCA criar uma versão paralela

### Exemplo ERRADO

```tsx
// ERRADO: recriou header com ícone + nome + recibo inline
<div className="flex items-center justify-between">
  <div className="flex items-center gap-4">
    <div className="flex size-12 items-center justify-center rounded-full bg-nova-primary-light">
      <DsIcon icon={serviceIcon} size="lg" className="text-primary" />
    </div>
    <p className="text-2xl font-medium">{entry.label}</p>
  </div>
  <button className="flex items-center gap-1 rounded-[6px] border ...">
    <DsIcon icon={ScrollIcon} size="md" />
    <span>Recibo</span>
  </button>
</div>
<p className="text-[48px] font-medium">{entry.date}</p>
```

### Exemplo CORRETO

```tsx
// CORRETO: usa o DsServiceDetailPopup que já tem ícone + nome + recibo + data
<DsServiceDetailPopup
  icon={serviceIcon}
  serviceName={entry.label}
  date={entry.date}
  onReceipt={() => {}}
>
  {/* conteúdo específico da tela */}
</DsServiceDetailPopup>
```

### Catálogo completo de componentes DS

#### Primitives (`src/design-system/primitives/`)
| Componente | Uso |
|---|---|
| `DsButton` | Botões primários, secundários, ghost, link |
| `DsIconButton` | Botão apenas com ícone |
| `DsInput` | Campo de texto |
| `DsPasswordInput` | Campo de senha com toggle de visibilidade |
| `DsTextarea` | Campo de texto multilinha |
| `DsSelect` | Select/dropdown nativo |
| `DsCheckbox` | Checkbox |
| `DsSwitch` | Toggle on/off |
| `DsToggleButton` | Botão toggle |
| `DsBadge` | Badge/tag |
| `DsLabel` | Label de formulário |
| `DsSeparator` | Linha divisória |
| `DsSkeleton` | Placeholder de loading |
| `DsScrollArea` | Área com scroll customizado |
| `DsTooltip` | Tooltip |

#### Media (`src/design-system/media/`)
| Componente | Uso |
|---|---|
| `DsIcon` | Wrapper de ícones Phosphor com sizes padronizados |
| `DsImage` | Imagem com fallback |

#### Forms (`src/design-system/forms/`)
| Componente | Uso |
|---|---|
| `DsFormField` | Wrapper label + input + erro |
| `DsFormGroup` | Grupo de campos com título |
| `DsDatePicker` | Seletor de data |
| `DsFilterDropdown` | Dropdown com filtros |
| `DsSearchInput` | Campo de busca com ícone |

#### Data Display (`src/design-system/data-display/`)
| Componente | Uso |
|---|---|
| `DsCard` | Card genérico |
| `DsAvatar` | Avatar circular |
| `DsStatCard` | Card de estatística com título + valor |
| `DsMetricCard` | Card de métrica |
| `DsDateBadge` | Badge com data formatada |
| `DsInfoChip` | Chip informativo |
| `DsEmptyState` | Estado vazio com ícone + mensagem |
| `DsDataTable` | Tabela de dados |
| `DsTableRowItem` | Linha de tabela |
| `DsPagination` | Paginação |
| `DsLineChart` | Gráfico de linha |
| `DsAgendaCard` | Card de agenda |
| `DsCreditCardDisplay` | Exibição visual de cartão de crédito |

#### Feedback (`src/design-system/feedback/`)
| Componente | Uso |
|---|---|
| `DsDialog` | Modal/dialog |
| `DsConfirmDialog` | Dialog de confirmação com ações |
| `DsSheet` | Drawer lateral (wrapper do Sheet) |
| `DsAlert` | Alerta/notificação inline |
| `DsNotificationBell` | Sino de notificações com badge |

#### Navigation (`src/design-system/navigation/`)
| Componente | Uso |
|---|---|
| `DsSidebar` | Sidebar principal |
| `DsSidebarItem` | Item da sidebar |
| `DsTopbar` | Barra superior |
| `DsNavLink` | Link de navegação |
| `DsLogo` | Logo da marca |
| `DsUserMenu` | Menu dropdown do usuário |
| `DsUserMenuItem` | Item do menu do usuário |

#### Layout (`src/design-system/layout/`)
| Componente | Uso |
|---|---|
| `DsPageContainer` | Container de página com padding padrão |
| `DsSection` | Seção com título |
| `DsSectionHeader` | Header de seção |
| `DsSidebarLayout` | Layout com sidebar + conteúdo |

#### Composite (`src/design-system/composite/`)
| Componente | Uso |
|---|---|
| `DsAuthLayout` | Layout de autenticação (login, registro) |
| `DsServiceDetailPopup` | Popup com ícone + nome do serviço + data + recibo + children |
| `DsServiceEditPopup` | Popup de edição de serviço |
| `DsSchedulePopup` | Popup de agendamento |
| `DsDeleteConfirmPopup` | Popup de confirmação de exclusão |
| `DsPopup` | Popup genérico |
| `DsUserFormPopup` | Popup de formulário de usuário |
| `DsApprovalPopup` | Popup de aprovação |
| `DsCollapsibleSection` | Seção colapsável com ícone + título |
| `DsRadioOptionCard` | Card de opção radio com badge opcional |
| `DsPaymentInfoCard` | Card de info de pagamento (ícone + descrição + valor + status) |
| `DsReceiptButton` | Botão de download de recibo |
| `DsHighlightCard` | Card destaque (título + valor grande + subtítulo) |
| `DsUpcomingServiceCard` | Card de próximo serviço com ações e recibo |
| `DsDiscountCard` | Card de desconto promocional |
| `DsServiceHistoryItem` | Linha de histórico de serviço (data + label + ações) |
| `DsServiceInfoCard` | Card informativo de serviço |
| `DsServiceOptionCard` | Card de opção de serviço |
| `DsServiceFormCard` | Card com formulário de serviço |
| `DsServiceManageCard` | Card de gerenciamento de serviço |
| `DsRecurrenceCard` | Card de configuração de recorrência |
| `DsFlowCard` | Card de fluxo/step |
| `DsFlowHeader` | Header de fluxo |
| `DsStepper` | Stepper de progresso |
| `DsProfileCard` | Card de perfil |
| `DsProfileSection` | Seção de perfil |
| `DsInfoPanel` | Painel informativo |
| `DsConfigSection` | Seção de configurações |
| `DsOptionsMenu` | Menu de opções |
| `DsDateTimePicker` | Seletor de data e hora |
| `DsTimeSlotPicker` | Seletor de horário |
| `DsChartSection` | Seção com gráfico |
| `DsStatusPill` | Pill de status (ativo, inativo, etc.) |
| `DsPaymentMethodOption` | Opção de método de pagamento |
| `DsPaymentOptionsCard` | Card com opções de pagamento |
| `DsSecurePaymentBanner` | Banner de pagamento seguro |
| `DsRecentPaymentItem` | Item de pagamento recente |
| `DsRegisteredCardItem` | Item de cartão cadastrado |
| `DsRegisteredCardList` | Lista de cartões cadastrados |
| `DsSavedCardItem` | Item de cartão salvo |
| `DsSavedCardList` | Lista de cartões salvos |
| `DsTransactionCard` | Card de transação |
| `DsTransactionTable` | Tabela de transações |
| `DsEmployeeInfoCard` | Card de info de funcionário |
| `DsEmployeeScheduleCard` | Card de agenda de funcionário |
| `DsUserTable` | Tabela de usuários |
| `DsUserActions` | Menu de ações do usuário (avatar dropdown) |
| `DsServiceDetailRow` | Linha de detalhe de serviço |
| `DsClientDashboardShell` | Shell do dashboard do cliente |
| `DsAdminSidebar` | Sidebar do admin |
| `DsClientSidebar` | Sidebar do cliente |

---

## 2. Imports

### Componentes DS

```tsx
// CORRETO: importar do barrel root
import { DsButton, DsInput, DsFormField, DsCollapsibleSection } from "@/design-system";

// CORRETO: importar do barrel de categoria
import { DsIcon } from "@/design-system/media";

// ERRADO: importar direto do arquivo
import { DsButton } from "@/design-system/primitives/ds-button";
```

### Ícones Phosphor

```tsx
// CORRETO: sempre do /dist/ssr para SSR compatibility
import { MapPinIcon, CreditCardIcon } from "@phosphor-icons/react/dist/ssr";

// ERRADO: importar da raiz
import { MapPinIcon } from "@phosphor-icons/react";
```

### Sheet/Dialog (componentes UI base)

```tsx
// CORRETO: Sheet é o único caso onde importamos de ui/
import { Sheet, SheetContent } from "@/design-system/ui/sheet";

// Ou usar o wrapper DsSheet se disponível
import { DsSheet } from "@/design-system";
```

---

## 3. Arquivos e Organização

### Regras

- **1 componente por arquivo** — sem exceções
- **1 widget/componente por arquivo** — extrair composições inline em arquivos separados quando representam uma seção distinta de UI
- Arquivos de UI NÃO devem conter lógica/funções — apenas handlers inline quando inevitável
- Preferir editar arquivos existentes a criar novos
- Máximo **800 linhas** por arquivo, ideal **200-400**

### Estrutura de páginas

```
src/app/dashboard/servicos/
  ├── page.tsx                        # Página principal (composição de componentes)
  └── _components/
      ├── services-history-panel.tsx   # Painel de histórico
      ├── services-side-panel.tsx      # Painel lateral
      ├── service-detail-modal.tsx     # Modal de detalhe
      └── service-edit-drawer.tsx      # Drawer de edição
```

### Exemplo ERRADO

```tsx
// ERRADO: lógica de formatação dentro do componente de UI
function ServiceCard({ entry }) {
  function formatDate(date: string) {
    return date.split("-").reverse().join("/");
  }
  function calculateDiscount(price: number) {
    return price * 0.95;
  }
  return <div>{formatDate(entry.date)} - R$ {calculateDiscount(entry.price)}</div>;
}
```

### Exemplo CORRETO

```tsx
// CORRETO: lógica em utils ou hooks, UI apenas renderiza
import { formatDate } from "@/lib/date-utils";
import { calculateDiscount } from "@/lib/pricing";

function ServiceCard({ entry }) {
  return <div>{formatDate(entry.date)} - R$ {calculateDiscount(entry.price)}</div>;
}
```

---

## 4. Estado e Hooks

### Zustand para estado compartilhado

```tsx
// CORRETO: estado compartilhado com Zustand
import { useDashboardStore } from "@/stores/dashboard-store";

function DashboardPage() {
  const { summary, isLoading } = useDashboardStore();
  // ...
}
```

### useState APENAS para estado local de UI

```tsx
// CORRETO: estado local temporário
const [isOpen, setIsOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState("");
const [selectedTab, setSelectedTab] = useState("all");

// ERRADO: estado compartilhado com useState
const [user, setUser] = useState(null); // deveria ser Zustand
const [services, setServices] = useState([]); // deveria ser Zustand
```

### Stores em `src/stores/`

```
src/stores/
  ├── dashboard-store.ts    # Estado do dashboard
  ├── auth-store.ts         # Estado de autenticação
  └── ...
```

---

## 5. Componentes DS — Convenções

### Criação de novo componente DS

```tsx
// src/design-system/composite/ds-my-component.tsx

import { cn } from "@/lib/utils";

interface DsMyComponentProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

function DsMyComponent({ title, children, className }: DsMyComponentProps) {
  return (
    <div className={cn("rounded-[10px] border border-nova-gray-100 p-4", className)}>
      <p className="text-xl font-medium text-black">{title}</p>
      {children}
    </div>
  );
}

export { DsMyComponent, type DsMyComponentProps };
```

### Checklist de convenções

- [ ] Prefixo `Ds` no nome
- [ ] Interface de props com nome `{ComponentName}Props`
- [ ] Export nomeado (NUNCA default export)
- [ ] Type export separado: `type DsMyComponentProps`
- [ ] `cn()` para merge de classes
- [ ] `className?: string` como prop opcional
- [ ] `"use client"` APENAS se usa hooks/estado
- [ ] Arquivo adicionado ao barrel `index.ts` da categoria

### DsIcon — Uso correto

```tsx
import { MapPinIcon } from "@phosphor-icons/react/dist/ssr";
import { DsIcon } from "@/design-system/media";

// Sizes disponíveis: xs(12), sm(16), md(20), lg(24), xl(32)
<DsIcon icon={MapPinIcon} size="md" />
<DsIcon icon={MapPinIcon} size="lg" className="text-primary" />
<DsIcon icon={MapPinIcon} size="md" weight="bold" className="text-nova-gray-700" />
```

---

## 6. Design Tokens e Cores

### Cores da marca (usar via Tailwind)

```tsx
// Primárias
className="text-nova-primary"         // Verde principal
className="text-nova-primary-dark"    // Verde escuro (datas, destaques)
className="bg-nova-primary-light"     // Verde claro (backgrounds de ícones)
className="bg-nova-primary-lighter"   // Verde mais claro (seleção)

// Semânticas
className="text-nova-success"
className="text-nova-warning"
className="text-nova-error"
className="text-nova-info"

// Escala de cinza
className="text-nova-gray-400"   // Texto secundário, disabled
className="text-nova-gray-700"   // Texto principal em cards
className="text-nova-gray-900"   // Texto mais escuro
className="bg-nova-gray-50"      // Background sutil
className="bg-nova-gray-100"     // Background de botões secundários
className="border-nova-gray-100" // Bordas de cards
className="border-nova-gray-300" // Bordas de botões outlined
```

### Exemplo: estado disabled

```tsx
// CORRETO: disabled sem opacity, usando cores específicas
className={disabled ? "text-nova-gray-400 cursor-not-allowed" : "text-nova-gray-700 cursor-pointer"}

// ERRADO: não usar opacity para disabled
className={disabled ? "opacity-50" : ""}
```

---

## 7. Commits

### Formato

```
<type>: <descrição curta em inglês>
```

### Tipos

| Tipo | Uso |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `refactor` | Refatoração sem mudança de comportamento |
| `style` | Formatação, espaçamento (sem mudança de código) |
| `chore` | Configuração, dependências |
| `docs` | Documentação |
| `test` | Testes |
| `perf` | Performance |

### Exemplos

```bash
# CORRETO
git commit -m "feat: add receipt button to upcoming service card"
git commit -m "fix: disable receipt when no scheduled service"
git commit -m "refactor: use DsServiceDetailPopup in edit drawer"

# ERRADO
git commit -m "feat: add receipt button to upcoming service card

Co-Authored-By: Claude <noreply@anthropic.com>"

# ERRADO: mensagem genérica
git commit -m "update files"
git commit -m "fix stuff"
```

### Staging

```bash
# CORRETO: staged por arquivo específico
git add src/design-system/composite/ds-upcoming-service-card.tsx
git commit -m "feat: add receiptDisabled prop to upcoming service card"

git add src/app/dashboard/servicos/_components/services-side-panel.tsx
git commit -m "feat: wire receiptDisabled to services side panel"

# ERRADO: nunca usar
git add -A
git add .
```

---

## 8. Verificação

SEMPRE rodar antes de considerar trabalho finalizado:

```bash
pnpm typecheck    # Verifica tipos TypeScript
pnpm lint         # Verifica ESLint + Prettier
```

Se ambos passarem sem erros, o trabalho está pronto.

---

## 9. Idioma

| Contexto | Idioma |
|---|---|
| Strings visíveis ao usuário | Português (pt-BR) |
| Nomes de variáveis, funções, tipos | Inglês |
| Commits | Inglês |
| Comentários no código | Inglês |
| Documentação técnica | Inglês |
| Labels de botões, títulos, mensagens | Português |

### Exemplos

```tsx
// CORRETO
<DsButton>Salvar alterações</DsButton>
<p>Cancelamento com 1h de antecedência</p>
const appointmentsCount = summary?.appointmentsCount ?? 0;

// ERRADO
<DsButton>Save changes</DsButton>  // UI deve ser pt-BR
const contadorAgendamentos = 0;     // variáveis devem ser em inglês
```

---

## 10. Composição de Telas — Workflow Completo

Ao receber um design (Figma) para implementar:

1. **Analisar o design** — identificar cada seção/bloco visual
2. **Mapear para componentes DS** — para cada bloco, encontrar o componente DS correspondente
3. **Verificar props** — ler o componente DS e confirmar que as props atendem ao design
4. **Estender se necessário** — adicionar props opcionais se o componente quase atende
5. **Compor a página** — montar usando apenas componentes DS + wrappers de layout
6. **Verificar** — `pnpm typecheck && pnpm lint`

### Exemplo prático: Drawer de edição de serviço

**Design mostra:** close button, ícone + nome + recibo, data, recorrência (radio), pagamento, localização (colapsável), ações, salvar

**Mapeamento:**

| Seção do design | Componente DS |
|---|---|
| Drawer container | `Sheet` + `SheetContent` |
| Ícone + nome + recibo + data | `DsServiceDetailPopup` |
| Radio options (Avulso/Pacote/Recorrência) | `DsRadioOptionCard` |
| Info de pagamento | `DsPaymentInfoCard` |
| Localização colapsável | `DsCollapsibleSection` + `DsFormField` + `DsInput` |
| Botão salvar | `DsButton` |

**Resultado:** zero HTML inline para seções que já existem no DS.
