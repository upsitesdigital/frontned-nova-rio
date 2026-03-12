# Project Guidelines — Nova Rio Frontend

---

## 1. Design System First (GOLDEN RULE)

BEFORE implementing ANY screen or UI component, follow this flow MANDATORILY:

### Step by step

1. **List candidate DS components** — browse `src/design-system/` and identify ALL components that may match the screen or section to be implemented
2. **Read each component** — open the file and understand its props, variants, slots (`children`) and behavior
3. **Compose the screen using DS components** — assemble the screen by combining existing components
4. **Only use raw HTML/Tailwind** for layout wrappers (`div`, `section`, `main`) or spacing between blocks
5. **If the DS component is close but not exact** — extend it with new optional props, NEVER create a parallel version

### WRONG Example

```tsx
// WRONG: recreated header with icon + name + receipt inline
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

### CORRECT Example

```tsx
// CORRECT: uses DsServiceDetailPopup which already has icon + name + receipt + date
<DsServiceDetailPopup
  icon={serviceIcon}
  serviceName={entry.label}
  date={entry.date}
  onReceipt={() => {}}
>
  {/* screen-specific content */}
</DsServiceDetailPopup>
```

### Full DS Component Catalog

#### Primitives (`src/design-system/primitives/`)
| Component | Usage |
|---|---|
| `DsButton` | Primary, secondary, ghost, link buttons |
| `DsIconButton` | Icon-only button |
| `DsInput` | Text input field |
| `DsPasswordInput` | Password field with visibility toggle |
| `DsTextarea` | Multiline text field |
| `DsSelect` | Native select/dropdown |
| `DsCheckbox` | Checkbox |
| `DsSwitch` | Toggle on/off |
| `DsToggleButton` | Toggle button |
| `DsBadge` | Badge/tag |
| `DsLabel` | Form label |
| `DsSeparator` | Divider line |
| `DsSkeleton` | Loading placeholder |
| `DsScrollArea` | Custom scroll area |
| `DsTooltip` | Tooltip |

#### Media (`src/design-system/media/`)
| Component | Usage |
|---|---|
| `DsIcon` | Phosphor icon wrapper with standardized sizes |
| `DsImage` | Image with fallback |

#### Forms (`src/design-system/forms/`)
| Component | Usage |
|---|---|
| `DsFormField` | Label + input + error wrapper |
| `DsFormGroup` | Field group with title |
| `DsDatePicker` | Date selector |
| `DsFilterDropdown` | Dropdown with filters |
| `DsSearchInput` | Search field with icon |

#### Data Display (`src/design-system/data-display/`)
| Component | Usage |
|---|---|
| `DsCard` | Generic card |
| `DsAvatar` | Circular avatar |
| `DsStatCard` | Stat card with title + value |
| `DsMetricCard` | Metric card |
| `DsDateBadge` | Badge with formatted date |
| `DsInfoChip` | Info chip |
| `DsEmptyState` | Empty state with icon + message |
| `DsDataTable` | Data table |
| `DsTableRowItem` | Table row |
| `DsPagination` | Pagination |
| `DsLineChart` | Line chart |
| `DsAgendaCard` | Agenda card |
| `DsCreditCardDisplay` | Visual credit card display |

#### Feedback (`src/design-system/feedback/`)
| Component | Usage |
|---|---|
| `DsDialog` | Modal/dialog |
| `DsConfirmDialog` | Confirmation dialog with actions |
| `DsSheet` | Side drawer (Sheet wrapper) |
| `DsAlert` | Inline alert/notification |
| `DsNotificationBell` | Notification bell with badge |

#### Navigation (`src/design-system/navigation/`)
| Component | Usage |
|---|---|
| `DsSidebar` | Main sidebar |
| `DsSidebarItem` | Sidebar item |
| `DsTopbar` | Top bar |
| `DsNavLink` | Navigation link |
| `DsLogo` | Brand logo |
| `DsUserMenu` | User dropdown menu |
| `DsUserMenuItem` | User menu item |

#### Layout (`src/design-system/layout/`)
| Component | Usage |
|---|---|
| `DsPageContainer` | Page container with standard padding |
| `DsSection` | Section with title |
| `DsSectionHeader` | Section header |
| `DsSidebarLayout` | Layout with sidebar + content |

#### Composite (`src/design-system/composite/`)
| Component | Usage |
|---|---|
| `DsAuthLayout` | Auth layout (login, register) |
| `DsServiceDetailPopup` | Popup with icon + service name + date + receipt + children |
| `DsServiceEditPopup` | Service edit popup |
| `DsSchedulePopup` | Scheduling popup |
| `DsDeleteConfirmPopup` | Delete confirmation popup |
| `DsPopup` | Generic popup |
| `DsUserFormPopup` | User form popup |
| `DsApprovalPopup` | Approval popup |
| `DsCollapsibleSection` | Collapsible section with icon + title |
| `DsRadioOptionCard` | Radio option card with optional badge |
| `DsPaymentInfoCard` | Payment info card (icon + description + value + status) |
| `DsReceiptButton` | Receipt download button |
| `DsHighlightCard` | Highlight card (title + large value + subtitle) |
| `DsUpcomingServiceCard` | Upcoming service card with actions and receipt |
| `DsDiscountCard` | Promotional discount card |
| `DsServiceHistoryItem` | Service history row (date + label + actions) |
| `DsServiceInfoCard` | Service info card |
| `DsServiceOptionCard` | Service option card |
| `DsServiceFormCard` | Card with service form |
| `DsServiceManageCard` | Service management card |
| `DsRecurrenceCard` | Recurrence configuration card |
| `DsFlowCard` | Flow/step card |
| `DsFlowHeader` | Flow header |
| `DsStepper` | Progress stepper |
| `DsProfileCard` | Profile card |
| `DsProfileSection` | Profile section |
| `DsInfoPanel` | Info panel |
| `DsConfigSection` | Settings section |
| `DsOptionsMenu` | Options menu |
| `DsDateTimePicker` | Date and time selector |
| `DsTimeSlotPicker` | Time slot selector |
| `DsChartSection` | Chart section |
| `DsStatusPill` | Status pill (active, inactive, etc.) |
| `DsPaymentMethodOption` | Payment method option |
| `DsPaymentOptionsCard` | Card with payment options |
| `DsSecurePaymentBanner` | Secure payment banner |
| `DsRecentPaymentItem` | Recent payment item |
| `DsRegisteredCardItem` | Registered card item |
| `DsRegisteredCardList` | Registered card list |
| `DsSavedCardItem` | Saved card item |
| `DsSavedCardList` | Saved card list |
| `DsTransactionCard` | Transaction card |
| `DsTransactionTable` | Transaction table |
| `DsEmployeeInfoCard` | Employee info card |
| `DsEmployeeScheduleCard` | Employee schedule card |
| `DsUserTable` | User table |
| `DsUserActions` | User actions menu (avatar dropdown) |
| `DsServiceDetailRow` | Service detail row |
| `DsClientDashboardShell` | Client dashboard shell |
| `DsAdminSidebar` | Admin sidebar |
| `DsClientSidebar` | Client sidebar |

---

## 2. Imports

### DS Components

```tsx
// CORRECT: import from root barrel
import { DsButton, DsInput, DsFormField, DsCollapsibleSection } from "@/design-system";

// CORRECT: import from category barrel
import { DsIcon } from "@/design-system/media";

// WRONG: import directly from file
import { DsButton } from "@/design-system/primitives/ds-button";
```

### Phosphor Icons

```tsx
// CORRECT: always from /dist/ssr for SSR compatibility
import { MapPinIcon, CreditCardIcon } from "@phosphor-icons/react/dist/ssr";

// WRONG: import from root
import { MapPinIcon } from "@phosphor-icons/react";
```

### Sheet/Dialog (base UI components)

```tsx
// CORRECT: Sheet is the only case where we import from ui/
import { Sheet, SheetContent } from "@/design-system/ui/sheet";

// Or use the DsSheet wrapper if available
import { DsSheet } from "@/design-system";
```

---

## 3. Files and Organization

### Rules

- **1 component per file** — no exceptions
- **1 widget/component per file** — extract inline compositions into separate files when they represent a distinct UI section
- UI files MUST NOT contain logic/functions — only inline handlers when unavoidable
- Prefer editing existing files over creating new ones
- Maximum **800 lines** per file, ideal **200-400**

### Page structure

```
src/app/dashboard/servicos/
  ├── page.tsx                        # Main page (component composition)
  └── _components/
      ├── services-history-panel.tsx   # History panel
      ├── services-side-panel.tsx      # Side panel
      ├── service-detail-modal.tsx     # Detail modal
      └── service-edit-drawer.tsx      # Edit drawer
```

### WRONG Example

```tsx
// WRONG: formatting logic inside UI component
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

### CORRECT Example

```tsx
// CORRECT: logic in utils or hooks, UI only renders
import { formatDate } from "@/lib/date-utils";
import { calculateDiscount } from "@/lib/pricing";

function ServiceCard({ entry }) {
  return <div>{formatDate(entry.date)} - R$ {calculateDiscount(entry.price)}</div>;
}
```

---

## 4. State Management

### NEVER use useState — EVER — FORBIDDEN

**useState is FORBIDDEN.** All state — without exception — MUST be managed with **Zustand**.

This includes state that seems "local" like `isOpen`, `searchQuery`, `selectedTab`. Create a dedicated store for each component/page that needs state.

This rule applies to ALL layers: pages, `_components/`, **and Design System components**.

```tsx
// FORBIDDEN: any use of useState — anywhere in the codebase
const [isOpen, setIsOpen] = useState(false);        // FORBIDDEN
const [searchQuery, setSearchQuery] = useState("");  // FORBIDDEN
const [selectedTab, setSelectedTab] = useState("all"); // FORBIDDEN
const [user, setUser] = useState(null);              // FORBIDDEN
const [services, setServices] = useState([]);        // FORBIDDEN
```

### Zustand for ALL state

```tsx
// CORRECT: state managed with Zustand
import { useDashboardStore } from "@/stores/dashboard-store";

function DashboardPage() {
  const { summary, isLoading } = useDashboardStore();
  // ...
}

// CORRECT: even local UI state uses Zustand
import { useServiceEditStore } from "@/stores/service-edit-store";

function ServiceEditDrawer() {
  const { isOpen, setIsOpen, selectedTab, setSelectedTab } = useServiceEditStore();
  // ...
}
```

### Stores in `src/stores/`

```
src/stores/
  ├── dashboard-store.ts    # Dashboard state
  ├── auth-store.ts         # Authentication state
  ├── login-store.ts        # Login flow
  └── ...                   # One store per domain/component
```

---

## 5. DS Components — Conventions

### Creating a new DS component

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

### State in DS components — ALWAYS Zustand

Interactive DS components that need state **MUST use Zustand**, NEVER `useState`. Create a dedicated store in `src/stores/` for the component.

```tsx
// FORBIDDEN: useState inside DS component
"use client";
function DsFilterDropdown({ options }: DsFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);       // FORBIDDEN
  const [selected, setSelected] = useState<string>(); // FORBIDDEN
  // ...
}

// CORRECT: Zustand store for the DS component
"use client";
import { useFilterDropdownStore } from "@/stores/filter-dropdown-store";

function DsFilterDropdown({ options }: DsFilterDropdownProps) {
  const { isOpen, setIsOpen, selected, setSelected } = useFilterDropdownStore();
  // ...
}
```

### Conventions checklist

- [ ] `Ds` prefix in the name
- [ ] Props interface named `{ComponentName}Props`
- [ ] Named export (NEVER default export)
- [ ] Separate type export: `type DsMyComponentProps`
- [ ] `cn()` for class merging
- [ ] `className?: string` as optional prop
- [ ] `"use client"` ONLY if it uses hooks/state
- [ ] **Zustand** for any state (NEVER `useState`)
- [ ] File added to the category barrel `index.ts`

### DsIcon — Correct usage

```tsx
import { MapPinIcon } from "@phosphor-icons/react/dist/ssr";
import { DsIcon } from "@/design-system/media";

// Available sizes: xs(12), sm(16), md(20), lg(24), xl(32)
<DsIcon icon={MapPinIcon} size="md" />
<DsIcon icon={MapPinIcon} size="lg" className="text-primary" />
<DsIcon icon={MapPinIcon} size="md" weight="bold" className="text-nova-gray-700" />
```

---

## 6. Design Tokens and Colors

### Brand colors (use via Tailwind)

```tsx
// Primary
className="text-nova-primary"         // Main green
className="text-nova-primary-dark"    // Dark green (dates, highlights)
className="bg-nova-primary-light"     // Light green (icon backgrounds)
className="bg-nova-primary-lighter"   // Lighter green (selection)

// Semantic
className="text-nova-success"
className="text-nova-warning"
className="text-nova-error"
className="text-nova-info"

// Gray scale
className="text-nova-gray-400"   // Secondary text, disabled
className="text-nova-gray-700"   // Primary text in cards
className="text-nova-gray-900"   // Darkest text
className="bg-nova-gray-50"      // Subtle background
className="bg-nova-gray-100"     // Secondary button background
className="border-nova-gray-100" // Card borders
className="border-nova-gray-300" // Outlined button borders
```

### Example: disabled state

```tsx
// CORRECT: disabled without opacity, using specific colors
className={disabled ? "text-nova-gray-400 cursor-not-allowed" : "text-nova-gray-700 cursor-pointer"}

// WRONG: do not use opacity for disabled
className={disabled ? "opacity-50" : ""}
```

---

## 7. Commits

### Format

```
<type>: <short description in English>
```

### Types

| Type | Usage |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Refactoring without behavior change |
| `style` | Formatting, spacing (no code change) |
| `chore` | Configuration, dependencies |
| `docs` | Documentation |
| `test` | Tests |
| `perf` | Performance |

### Examples

```bash
# CORRECT
git commit -m "feat: add receipt button to upcoming service card"
git commit -m "fix: disable receipt when no scheduled service"
git commit -m "refactor: use DsServiceDetailPopup in edit drawer"

# WRONG
git commit -m "feat: add receipt button to upcoming service card

Co-Authored-By: Claude <noreply@anthropic.com>"

# WRONG: generic message
git commit -m "update files"
git commit -m "fix stuff"
```

### Staging

```bash
# CORRECT: stage specific files
git add src/design-system/composite/ds-upcoming-service-card.tsx
git commit -m "feat: add receiptDisabled prop to upcoming service card"

git add src/app/dashboard/servicos/_components/services-side-panel.tsx
git commit -m "feat: wire receiptDisabled to services side panel"

# WRONG: never use
git add -A
git add .
```

---

## 8. Verification

ALWAYS run before considering work done:

```bash
pnpm typecheck    # TypeScript type checking
pnpm lint         # ESLint + Prettier
```

If both pass without errors, the work is ready.

### ESLint Disable Comments — FORBIDDEN

**NEVER** use ESLint disable comments to suppress warnings or errors. Fix the root cause instead.

```tsx
// FORBIDDEN: any form of eslint-disable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line react-hooks/exhaustive-deps
/* eslint-disable @typescript-eslint/no-explicit-any */

// CORRECT: fix the actual issue
// - Remove unused variables
// - Add missing dependencies to useEffect
// - Use proper types instead of `any`
```

If a lint rule flags your code, it means the code needs to be fixed — not the rule silenced.

### Type Assertions — `as any` FORBIDDEN

**NEVER** use `as any`, `as unknown as T`, or similar type escape hatches. Always use proper types.

```tsx
// FORBIDDEN: any form of type escape
const result = someValue as any;
const data = response as unknown as MyType;
const user: any = getUser();
function process(data: any) { ... }

// CORRECT: use proper types
const result: DashboardSummary = someValue;
const data: MyType = response;

// CORRECT: use generics when the type varies
function fetchData<T>(url: string): Promise<T> { ... }
```

If TypeScript complains about a type, it means the type system is telling you something is wrong — fix the types, don't silence the compiler.

---

## 9. Language

| Context | Language |
|---|---|
| User-facing strings | Portuguese (pt-BR) |
| Variable, function, type names | English |
| Commits | English |
| Code comments | English |
| Technical documentation | English |
| Button labels, titles, messages | Portuguese |

### Examples

```tsx
// CORRECT
<DsButton>Salvar alterações</DsButton>
<p>Cancelamento com 1h de antecedência</p>
const appointmentsCount = summary?.appointmentsCount ?? 0;

// WRONG
<DsButton>Save changes</DsButton>  // UI must be pt-BR
const contadorAgendamentos = 0;     // variables must be in English
```

---

## 10. Screen Composition — Full Workflow

When receiving a design (Figma) to implement:

1. **Analyze the design** — identify each section/visual block
2. **Map to DS components** — for each block, find the corresponding DS component
3. **Check props** — read the DS component and confirm props match the design
4. **Extend if needed** — add optional props if the component almost fits
5. **Compose the page** — build using only DS components + layout wrappers
6. **Verify** — `pnpm typecheck && pnpm lint`

### Practical example: Service edit drawer

**Design shows:** close button, icon + name + receipt, date, recurrence (radio), payment, location (collapsible), actions, save

**Mapping:**

| Design section | DS Component |
|---|---|
| Drawer container | `Sheet` + `SheetContent` |
| Icon + name + receipt + date | `DsServiceDetailPopup` |
| Radio options (Single/Package/Recurrence) | `DsRadioOptionCard` |
| Payment info | `DsPaymentInfoCard` |
| Collapsible location | `DsCollapsibleSection` + `DsFormField` + `DsInput` |
| Save button | `DsButton` |

**Result:** zero inline HTML for sections that already exist in the DS.

---

## 11. Backend Connection (MANDATORY)

**ALWAYS connect to the backend when creating app components.** No UI component should exist without its corresponding backend integration.

### Rule

Every interactive component that creates, reads, updates, or deletes data MUST be connected to the backend through the proper architecture layers:

1. **API Layer** (`src/api/`) — Create typed request/response interfaces and API functions using `httpAuth*` helpers
2. **Store** (`src/stores/`) — Add async actions that call the API functions, handle loading/error states
3. **Component** (`src/app/**/`) — Wire the store actions to UI events (buttons, forms, etc.)

### WRONG Example

```tsx
// WRONG: drawer with save button that does nothing / only calls a local callback
<DsButton onClick={() => { onSave?.(entry); onClose(); }}>
  Salvar alterações
</DsButton>
```

### CORRECT Example

```tsx
// CORRECT: drawer calls store action → store calls API → API calls backend
<DsButton onClick={() => saveServiceEdit(entry.id)}>
  Salvar alterações
</DsButton>

// In store:
saveServiceEdit: async (id) => {
  const token = useAuthStore.getState().accessToken;
  await rescheduleAppointment(token, id, { date, startTime });
  await loadSummary(); // refresh data
}

// In API layer:
async function rescheduleAppointment(token, id, data) {
  return httpAuthPost(`/appointments/${id}/reschedule`, data, token);
}
```

### Checklist

- [ ] API function exists in `src/api/`
- [ ] Store action exists in `src/stores/`
- [ ] Component wires store action to UI event
- [ ] Loading and error states handled
- [ ] Data refreshed after mutation

---

## 12. Clean Architecture — Frontend Layers

The frontend follows Clean Architecture principles (Uncle Bob) adapted to the React/Next.js context. Dependencies always point inward — outer layers know about inner layers, never the reverse.

### Layer diagram

```
┌─────────────────────────────────────────────────┐
│  Pages / _components/   (Interface Adapters)    │ ← src/app/**/page.tsx, _components/
│  Screen composition using DS + stores           │
├─────────────────────────────────────────────────┤
│  Stores                 (Application Layer)     │ ← src/stores/
│  Orchestrate logic, call API, manage state      │
├─────────────────────────────────────────────────┤
│  API Layer              (Infrastructure)        │ ← src/api/
│  HTTP client, endpoints, serialization          │
├─────────────────────────────────────────────────┤
│  Design System          (Presentation)          │ ← src/design-system/
│  Pure components, no business logic             │
│  Interactive state managed via Zustand stores   │
├─────────────────────────────────────────────────┤
│  Shared / Domain        (Domain)                │ ← src/lib/, types, interfaces
│  Types, utilities, contracts                    │
└─────────────────────────────────────────────────┘
```

### Dependency Rule

| Layer | Can import from | CANNOT import from |
|---|---|---|
| Pages / _components | stores, design-system, lib | — |
| Stores | api, lib | pages, design-system |
| API Layer | lib | pages, stores, design-system |
| Design System | stores, lib (`cn()`) | pages, api |
| Shared / Domain | nothing (innermost layer) | everything above |

### WRONG Example

```tsx
// WRONG: page calling fetch directly (skips store and api layer)
function DashboardPage() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/api/dashboard").then(r => r.json()).then(setData);
  }, []);
}
```

### CORRECT Example

```tsx
// CORRECT: page uses store → store uses api layer
// src/app/dashboard/page.tsx
function DashboardPage() {
  const { summary, isLoading, fetchSummary } = useDashboardStore();
  useEffect(() => { fetchSummary(); }, [fetchSummary]);
}

// src/stores/dashboard-store.ts
const useDashboardStore = create((set) => ({
  fetchSummary: async () => {
    const summary = await getDashboardSummary(token);
    set({ summary });
  },
}));

// src/api/dashboard-api.ts
async function getDashboardSummary(token: string) {
  return httpAuthGet("/dashboard/summary", token);
}
```

---

## 13. SOLID — Principles in the Frontend

### S — Single Responsibility Principle (SRP)

Each unit has ONE responsibility:

| Unit | Responsibility |
|---|---|
| DS Component | Render pure UI, no business logic |
| Page (`page.tsx`) | Compose components and connect to store |
| `_components/*` | Isolated page section |
| Store (Zustand) | Orchestrate state and logic for ONE domain |
| API function | ONE HTTP call for ONE endpoint |
| Utility (`lib/`) | ONE transformation or calculation |

```tsx
// WRONG: store does everything (auth + dashboard + services)
const useAppStore = create((set) => ({
  user: null, services: [], payments: [],
  login: async () => { /* ... */ },
  fetchServices: async () => { /* ... */ },
  fetchPayments: async () => { /* ... */ },
}));

// CORRECT: stores separated by domain
// src/stores/auth-store.ts     → authentication
// src/stores/dashboard-store.ts → dashboard data
// src/stores/login-store.ts    → login flow
```

### O — Open/Closed Principle (OCP)

DS components are **open for extension** (new optional props) and **closed for modification** (don't change existing behavior).

```tsx
// CORRECT: extend DsButton with new variant without breaking existing ones
// Before: variant = "primary" | "secondary" | "ghost"
// After:  variant = "primary" | "secondary" | "ghost" | "danger"
// Existing props keep working the same

// WRONG: create <DsButtonV2> or <CustomButton> in parallel
// WRONG: change variant="primary" behavior to accommodate new use case
```

### L — Liskov Substitution Principle (LSP)

DS components that share an interface must be interchangeable in the expected context.

```tsx
// All card components accept className and children
// and behave consistently:
<DsCard className="p-4">{content}</DsCard>
<DsStatCard title="Total" value="42" />
<DsHighlightCard title="Receita" value="R$ 1.200" />

// If a component accepts a prop, it must have the same semantic effect
// as in other components of the same type.
// Ex: className always merges via cn(), never replaces base classes.
```

### I — Interface Segregation Principle (ISP)

Stores and prop interfaces must be focused — consumers use only what they need.

```tsx
// CORRECT: segregated stores, each with minimal interface
const { accessToken } = useAuthStore();           // only needs the token
const { summary, isLoading } = useDashboardStore(); // only needs the summary

// WRONG: god-store that forces everyone to know everything
const { user, services, payments, notifications, settings } = useAppStore();

// CORRECT: DS component props with minimal interface
interface DsEmptyStateProps {
  icon: React.ElementType;
  title: string;
  description?: string;
}

// WRONG: component that requires unnecessary props to work
interface DsEmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;  // required even when not used
  onRetry: () => void;  // required even without retry action
  theme: "light" | "dark"; // required even with obvious default
}
```

### D — Dependency Inversion Principle (DIP)

Upper layers depend on abstractions (interfaces/types), not implementation details.

```tsx
// CORRECT: page depends on store (abstraction), not on fetch/API directly
function DashboardPage() {
  const { summary } = useDashboardStore(); // doesn't know where data comes from
}

// CORRECT: store depends on api layer function, not on raw fetch
const useDashboardStore = create((set) => ({
  fetchSummary: async () => {
    const data = await getDashboardSummary(token); // abstraction
    set({ summary: data });
  },
}));

// CORRECT: api layer encapsulates HTTP details
async function getDashboardSummary(token: string) {
  return httpAuthGet<DashboardSummary>("/dashboard/summary", token);
}

// WRONG: store knows HTTP implementation details
const useDashboardStore = create((set) => ({
  fetchSummary: async () => {
    const res = await fetch("http://localhost:3001/dashboard/summary", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    set({ summary: data });
  },
}));
```

### Practical summary

| Principle | Frontend rule |
|---|---|
| **SRP** | 1 component/file, 1 store/domain, 1 function/endpoint |
| **OCP** | Extend DS with optional props, never create parallel version |
| **LSP** | DS components with same interface behave consistently |
| **ISP** | Stores focused per domain, minimal and optional props when possible |
| **DIP** | Page → Store → API → HTTP Client (each layer abstracts the next) |
