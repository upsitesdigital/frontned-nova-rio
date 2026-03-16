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

This rule applies to ALL layers: pages, `_components/`, **and Design System components**. DS components receive state as required props from the parent, which manages it via Zustand.

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

### State in DS components — controlled-only via required props

Interactive DS components that need state are **purely controlled** — both the value prop and change handler are **required**. The parent passes state from a Zustand store.

```tsx
// FORBIDDEN: useState inside DS component
"use client";
function DsCollapsibleSection({ open, onOpenChange }: DsCollapsibleSectionProps) {
  const [internalOpen, setInternalOpen] = useState(true); // FORBIDDEN
  // ...
}

// CORRECT: required props, no internal state
"use client";
interface DsCollapsibleSectionProps {
  open: boolean;          // required — no optional fallback
  onOpenChange: (open: boolean) => void; // required — no optional fallback
  // ...
}

function DsCollapsibleSection({ open, onOpenChange }: DsCollapsibleSectionProps) {
  return <Collapsible.Root open={open} onOpenChange={onOpenChange} />;
}

// Parent manages state via Zustand:
const isOpen = useServiceEditStore((s) => s.addressSectionOpen);
const setIsOpen = useServiceEditStore((s) => s.setAddressSectionOpen);
<DsCollapsibleSection open={isOpen} onOpenChange={setIsOpen} />
```

### `"use client"` directive — MANDATORY rules

Add `"use client"` to any component that:
- Uses hooks (`useState`, `useEffect`, `useRef`, etc.)
- Uses event handlers (`onClick`, `onKeyDown`, etc.)
- Is imported by other client components (even if the component itself is pure)

When in doubt, add it — missing directives break the Next.js build.

### Controlled-only pattern — MANDATORY for state props

Components with state props (`open`, `collapsed`, `visible`) are **purely controlled** — both the value and the change handler are **required** props. No internal `useState` fallback. State is always managed externally via Zustand stores.

```tsx
// CORRECT: purely controlled, required props
interface DsCollapsibleSectionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // ...
}

function DsCollapsibleSection({ open, onOpenChange }: DsCollapsibleSectionProps) {
  return <Collapsible.Root open={open} onOpenChange={onOpenChange} />;
}

// WRONG: internal useState fallback
function DsCollapsibleSection({ open: controlledOpen, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(true); // FORBIDDEN
  const isControlled = onOpenChange !== undefined;
  // ...
}
```

### Keyboard accessibility

Interactive elements with `role="button"` must handle both Enter AND Space keys:

```tsx
onKeyDown={(e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault(); // prevent scroll on Space
    onSelect();
  }
}}
```

### Conventions checklist

- [ ] `Ds` prefix in the name
- [ ] Props interface named `{ComponentName}Props`
- [ ] Named export (NEVER default export)
- [ ] Separate type export: `type DsMyComponentProps`
- [ ] `cn()` for class merging
- [ ] `className?: string` as optional prop
- [ ] `"use client"` on any component with hooks, events, or imported by client components
- [ ] Controlled-only pattern: state props + change handlers are required (no useState fallback)
- [ ] Space + Enter keyboard handling on `role="button"` elements
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
className="bg-nova-warning-light"     // Solid yellow (badges)
className="bg-nova-warning-lighter"   // 10% orange (icon backgrounds)
className="text-nova-error"
className="text-nova-info"
className="bg-nova-info-light"        // 10% blue (icon backgrounds)

// Category colors
className="text-nova-purple"          // Purple (clients, categories)
className="bg-nova-purple-light"      // 10% purple (icon backgrounds)
className="text-nova-lime"            // Lime/yellow-green (reports)
className="bg-nova-lime-light"        // 10% lime (icon backgrounds)

// Gray scale
className="text-nova-gray-400"   // Secondary text, disabled
className="text-nova-gray-700"   // Primary text in cards
className="text-nova-gray-900"   // Darkest text
className="bg-nova-gray-50"      // Subtle background
className="bg-nova-gray-100"     // Secondary button background
className="border-nova-gray-100" // Card borders
className="border-nova-gray-300" // Outlined button borders
```

### Hardcoded colors — FORBIDDEN

**NEVER** use hardcoded hex/rgba values in Tailwind classes. Always use design tokens defined in `globals.css`.

If a color from Figma does not exist as a token, **add it to `globals.css`** as a CSS variable (both `--nova-*` definition and `--color-nova-*` Tailwind mapping) and to `src/design-system/tokens/colors.ts` before using it.

```tsx
// FORBIDDEN: hardcoded colors
className="text-[#54336f]"
className="bg-[rgba(84,51,111,0.1)]"
className="text-[#00a0d2]"

// CORRECT: use design tokens
className="text-nova-purple"
className="bg-nova-purple-light"
className="text-nova-info"
```

### Example: disabled state

```tsx
// CORRECT: disabled without opacity, using specific colors
className={disabled ? "text-nova-gray-400 cursor-not-allowed" : "text-nova-gray-700 cursor-pointer"}

// WRONG: do not use opacity for disabled
className={disabled ? "opacity-50" : ""}
```

---

## 7. Validation — Zod 4

All form validation uses **Zod 4** (`zod/v4`). Never use `validator.js`, inline regex, or other validation libraries.

```tsx
// CORRECT: Zod schema
import { z } from "zod/v4";
const emailSchema = z.string().email();
const codeSchema = z.string().regex(/^\d{6}$/, "Code must be 6 digits");

// WRONG: validator.js
import isEmail from "validator/es/lib/isEmail";

// WRONG: invalid Zod API
const emailSchema = z.email(); // z.email() does not exist, use z.string().email()
```

## 8. Pagination — Clamping

When implementing pagination, always clamp `currentPage` and use the clamped value consistently:

```tsx
const clampedPage = Math.max(1, Math.min(currentPage, Math.max(1, totalPages)));
const showingCount = Math.max(0, Math.min(pageSize, totalItems - (clampedPage - 1) * pageSize));

// Use clampedPage for: label, disabled state, onClick, active styling
disabled={clampedPage <= 1}
page === clampedPage ? "active" : "inactive"
```

Show `DsEmptyState` when filtered results are empty (distinct from "no data loaded").

## 9. Commits

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

## 10. Verification

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

## 11. Language

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

## 12. Screen Composition — Full Workflow

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

## 13. Backend Connection (MANDATORY)

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
  await rescheduleAppointment(id, { date, startTime });
  await loadSummary(); // refresh data
}

// In API layer (auth handled internally by configureAuthProvider):
async function rescheduleAppointment(id, data) {
  return httpAuthPost(`/appointments/${id}/reschedule`, data);
}
```

### Checklist

- [ ] API function exists in `src/api/`
- [ ] Store action exists in `src/stores/`
- [ ] Component wires store action to UI event
- [ ] Loading and error states handled
- [ ] Data refreshed after mutation

---

## 14. Clean Architecture — Frontend Layers

The frontend follows **Clean Architecture** principles (Robert C. Martin / Uncle Bob) adapted to the React/Next.js context. The core idea: organize code into concentric layers where **dependencies always point inward** — outer layers know about inner layers, never the reverse.

### Foundational principles

1. **Separation of Concerns** — Each layer handles ONE distinct responsibility, making the codebase easier to understand, modify, and maintain.
2. **Dependency Rule** — Inner layers NEVER depend on outer layers. This keeps core logic framework-agnostic, modular, and easy to refactor.
3. **Testability** — Business rules and use cases can be tested in isolation, without UI, database, or external services.
4. **Framework Independence** — Core logic uses plain TypeScript. Next.js, React, and Zustand are implementation details confined to their respective layers.

### Layer diagram

```
┌──────────────────────────────────────────────────────────────────┐
│  Frameworks & Drivers           (Outermost Layer)                │
│  Next.js pages, _components/, layouts, styles                    │
│  ← src/app/**/page.tsx, _components/                             │
│  ONLY consumes: stores, design-system, lib                       │
├──────────────────────────────────────────────────────────────────┤
│  Interface Adapters             (Controllers / Presenters)       │
│  Zustand stores: thin state containers that delegate to use cases│
│  ← src/stores/                                                   │
│  ONLY consumes: use-cases, lib                                   │
├──────────────────────────────────────────────────────────────────┤
│  Application Layer              (Use Cases)                      │
│  Business logic orchestration: what the system CAN DO            │
│  Error handling, data transformation, multi-API coordination     │
│  ← src/use-cases/                                                │
│  ONLY consumes: api, lib                                         │
├──────────────────────────────────────────────────────────────────┤
│  Infrastructure / Gateway       (API Layer)                      │
│  Pure HTTP wrappers, one function per endpoint                   │
│  ← src/api/                                                      │
│  ONLY consumes: lib (http-client)                                │
├──────────────────────────────────────────────────────────────────┤
│  Design System                  (Presentation)                   │
│  Pure UI components, no business logic                           │
│  ← src/design-system/                                            │
│  ONLY consumes: lib (cn())                                       │
├──────────────────────────────────────────────────────────────────┤
│  Domain / Entities              (Innermost Layer)                │
│  Types, interfaces, pure functions, constants, messages          │
│  Enterprise Business Rules — rarely change                       │
│  ← src/lib/, src/types/, src/validation/                         │
│  IMPORTS NOTHING from outer layers                               │
└──────────────────────────────────────────────────────────────────┘
```

### Layer responsibilities in detail

#### Domain / Entities (`src/lib/`, `src/types/`, `src/validation/`)

The **innermost layer**. Defines core business models, type contracts, validation rules, centralized messages, and utility functions using plain TypeScript. These represent "Enterprise Business Rules" — rules that rarely change when external factors (UI framework, database, API provider) shift.

```tsx
// src/types/appointment.ts — Domain entity (plain TypeScript, no framework imports)
interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "completed" | "cancelled";
}

// src/lib/appointment-rules.ts — Enterprise business rule
function canCancelAppointment(appointment: Appointment): boolean {
  const appointmentDate = new Date(`${appointment.date}T${appointment.startTime}`);
  const now = new Date();
  const hoursUntil = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursUntil >= 1 && appointment.status === "scheduled";
}

// src/lib/messages.ts — Centralized user-facing strings
const MESSAGES = {
  auth: { sessionExpired: "Sessão expirada. Faça login novamente." },
  profile: { loadError: "Erro ao carregar o perfil.", updated: "Perfil atualizado!" },
  adminEmployees: { loadError: "Erro ao carregar funcionários." },
  // ... all user-facing strings live here, NEVER hardcoded in stores/use-cases
} as const;
```

**Rules:**
- NEVER import from pages, stores, use-cases, api, or design-system
- NEVER use React, Next.js, or Zustand here
- Only plain TypeScript: types, interfaces, pure functions, constants
- ALL user-facing Portuguese strings MUST be defined in `src/lib/messages.ts`

#### Infrastructure / Gateway (`src/api/`)

Pure HTTP wrappers. Each function maps to ONE backend endpoint. No business logic, no error classification, no data transformation. Just HTTP in, typed response out.

```tsx
// src/api/admin-employees-api.ts — Pure HTTP gateway
async function fetchAdminEmployees(
  params: ListAdminEmployeesParams,
  signal?: AbortSignal,
): Promise<AdminEmployeesResponse> {
  const searchParams = new URLSearchParams({ page: String(params.page), limit: String(params.limit) });
  if (params.status) searchParams.set("status", params.status);
  return httpAuthGet<AdminEmployeesResponse>(`/employees?${searchParams}`, signal);
}

async function fetchAdminEmployeeById(id: number): Promise<AdminEmployee> {
  return httpAuthGet<AdminEmployee>(`/employees/${id}`);
}

async function updateAdminEmployee(id: number, data: Partial<AdminEmployee>): Promise<AdminEmployee> {
  return httpAuthPatchWithBody<AdminEmployee>(`/employees/${id}`, data);
}
```

**Rules:**
- ONE function per endpoint (Single Responsibility)
- Auth handled by `configureAuthProvider` — NEVER pass tokens as parameters
- ZERO business logic — no try/catch, no error classification, no data mapping
- ONLY imports from `lib/` (http-client helpers, types)
- NEVER imports from pages, stores, use-cases, or design-system

#### Application Layer / Use Cases (`src/use-cases/`)

Defines what the system **can do**. Each use case orchestrates one or more API calls, handles errors, classifies error types (auth vs transient), transforms data, and returns a typed result. This is where **business logic lives** on the frontend.

```tsx
// src/use-cases/load-admin-employees.ts — Business logic orchestration
import { fetchAdminEmployees, type AdminEmployee } from "@/api/admin-employees-api";
import { isAuthError, resolveErrorMessage } from "@/lib/auth-helpers";
import { MESSAGES } from "@/lib/messages";

interface LoadAdminEmployeesInput {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}

interface AdminEmployeesLoadResult {
  data: { employees: AdminEmployee[]; total: number } | null;
  error: string | null;
  isAuthError: boolean;
}

async function loadAdminEmployees(
  input: LoadAdminEmployeesInput,
): Promise<AdminEmployeesLoadResult> {
  try {
    const params = { page: input.page, limit: input.limit };
    if (input.status && input.status !== "all") params.status = input.status;
    if (input.search) params.search = input.search;

    const response = await fetchAdminEmployees(params);
    return { data: { employees: response.data, total: response.total }, error: null, isAuthError: false };
  } catch (error) {
    return {
      data: null,
      error: resolveErrorMessage(error, MESSAGES.adminEmployees.loadError),
      isAuthError: isAuthError(error),
    };
  }
}

export { loadAdminEmployees, type LoadAdminEmployeesInput, type AdminEmployeesLoadResult };
```

**Use case patterns:**

| Pattern | When to use | Example |
|---------|-------------|---------|
| `{ data, error, isAuthError }` | Data loading with auth redirect | `loadAdminAppointments`, `loadAdminEmployees` |
| `{ success: true, data } \| { success: false, error }` | Mutations (save, delete) | `saveAdminEmployee`, `submitPayment` |
| `Promise<Date[]>` | Simple data without error UI | `loadEmployeeBusyDates` |
| `Promise<void>` | Fire-and-forget actions | `downloadReceipt` |

**Rules:**
- ONE use case per file, named by its action (NEVER `call`, `execute`, `run`)
- Import from `src/api/` and `src/lib/` ONLY
- NEVER import from stores, pages, or design-system
- ALL error strings come from `MESSAGES` — never hardcoded
- Use `resolveErrorMessage()` and `isAuthError()` from `@/lib/auth-helpers` for consistent error handling
- Can orchestrate multiple API calls (e.g., `Promise.all([fetchEmployee, fetchUnits])`)
- Shared use cases eliminate duplication (e.g., `loadEmployeeBusyDates` used by two stores)

**Orchestration use cases (`sign-out-admin`, `sign-out-client`):**

Some use cases coordinate store resets instead of API calls. These live in `src/use-cases/` because they orchestrate application-level behavior:

```tsx
// src/use-cases/sign-out-client.ts — Orchestration use case
import { useAuthStore } from "@/stores/auth-store";
import { useDashboardStore } from "@/stores/dashboard-store";
// ... other store imports

function signOutClient(): void {
  useAuthStore.getState().reset();
  useDashboardStore.getState().reset();
  // ... reset all client-scoped stores
}
```

#### Interface Adapters / Controllers (`src/stores/`)

Zustand stores act as **thin state containers**. They hold UI state (loading, error, pagination, filters) and delegate all business logic to use cases. Stores NEVER call API functions directly or contain error handling/classification logic.

```tsx
// src/stores/admin-employees-store.ts — Thin state container
import { create } from "zustand";
import { loadAdminEmployees } from "@/use-cases/load-admin-employees";
import type { AdminEmployee } from "@/api/admin-employees-api";

const useAdminEmployeesStore = create<AdminEmployeesStore>((set, get) => ({
  employees: [],
  totalEmployees: 0,
  currentPage: 1,
  isLoading: false,
  error: null,
  isAuthError: false,
  statusFilter: "all",
  searchQuery: "",

  // Store delegates to use case — no try/catch, no error classification
  loadEmployees: async () => {
    const { statusFilter, searchQuery, currentPage } = get();
    set({ isLoading: true, error: null, isAuthError: false });

    const result = await loadAdminEmployees({
      page: currentPage,
      limit: PAGE_SIZE,
      status: statusFilter === "all" ? undefined : statusFilter,
      search: searchQuery || undefined,
    });

    if (result.data) {
      set({ employees: result.data.employees, totalEmployees: result.data.total, isLoading: false });
    } else {
      set({ isLoading: false, error: result.error, isAuthError: result.isAuthError });
    }
  },

  setStatusFilter: (filter) => {
    set({ statusFilter: filter, currentPage: 1 });
    get().loadEmployees();
  },
}));
```

**Rules:**
- ONE store per domain (appointments, auth, dashboard, etc.)
- Stores delegate to use cases — NEVER call API functions directly
- NEVER contain try/catch for API errors — that belongs in use cases
- NEVER import from `src/api/` (except for type-only imports)
- Auth tokens handled internally by `httpAuth*` — NEVER pass tokens manually
- Distinguish auth errors (401/403) from transient errors — use `isAuthError` flag from use case result
- Stores handle loading, error, and success states (UI concerns)
- NEVER imports from pages or design-system

**Auth hydration — MANDATORY on mount:**

```tsx
// In layout/page useEffect:
useEffect(() => {
  waitForAuthHydration().then(() => {
    loadSummary();    // only after tokens are hydrated
    loadPayments();
  });
}, [loadSummary, loadPayments]);

// WRONG: fires before tokens are available
useEffect(() => {
  loadSummary();  // may send empty bearer token → 401
}, [loadSummary]);
```

**Auth store — persist BOTH tokens:**

```tsx
persist(
  (set) => ({ /* ... */ }),
  {
    name: "nova-rio-auth",
    partialize: (state) => ({
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,  // MUST persist for page reload survival
    }),
  },
);
```

#### Frameworks & Drivers (`src/app/**/`, `src/design-system/`)

The **outermost layer**. Next.js pages, `_components/`, and DS components. Pages compose UI using design-system components and connect to stores. They NEVER contain business logic, HTTP calls, or functions.

```tsx
// src/app/admin/funcionarios/page.tsx — Thin UI layer
"use client";

import { useEffect } from "react";
import { useAdminEmployeesStore } from "@/stores/admin-employees-store";
import { waitForAuthHydration } from "@/stores/auth-store";
import { DsPageHeader, DsSkeleton, DsAlert } from "@/design-system";
import { EmployeesFilterBar } from "./_components/employees-filter-bar";
import { EmployeesList } from "./_components/employees-list";

export default function AdminEmployeesPage() {
  const { isLoading, error, loadEmployees } = useAdminEmployeesStore();

  useEffect(() => {
    waitForAuthHydration().then(() => loadEmployees());
  }, [loadEmployees]);

  if (isLoading) return <DsSkeleton className="h-40" />;
  if (error) return <DsAlert variant="error" title={error} />;

  return (
    <div className="flex flex-col gap-6">
      <DsPageHeader title="Funcionários" subtitle="Gerencie a equipe." />
      <EmployeesFilterBar />
      <EmployeesList />
    </div>
  );
}
```

**Rules:**
- Pages are THIN — compose DS components and connect to stores
- NEVER call `fetch`, axios, or HTTP directly
- NEVER implement business logic (validation, calculations, formatting)
- NEVER create functions in UI files — extract to `src/lib/` or bind store actions directly (e.g., `onClick={saveEmployee}`, not `onClick={handleSave}` where handleSave is a trivial wrapper)
- Design System components are PURE — no business logic, no API calls

### Dependency Rule (strict)

| Layer | Path | Can import from | CANNOT import from |
|---|---|---|---|
| Frameworks & Drivers | `src/app/**/` | stores, design-system, lib | api, use-cases (directly) |
| Interface Adapters | `src/stores/` | use-cases, lib | pages, design-system, api (except type-only) |
| Application (Use Cases) | `src/use-cases/` | api, lib | pages, stores, design-system |
| Infrastructure (Gateway) | `src/api/` | lib | pages, stores, use-cases, design-system |
| Presentation | `src/design-system/` | lib (`cn()`) | pages, api, stores, use-cases |
| Domain / Entities | `src/lib/`, `src/types/` | nothing (innermost) | everything above |

### Data flow

```
User clicks button
  → Page calls store action              (Frameworks → Interface Adapters)
    → Store calls use case function       (Interface Adapters → Application)
      → Use case calls API function(s)    (Application → Infrastructure)
        → API calls httpAuth*             (Infrastructure → HTTP)
          → HTTP response returns
        → API returns typed data
      → Use case transforms/classifies data, handles errors
      → Use case returns typed result
    → Store updates state from result
  → Page re-renders with new data         (React reactivity)
```

### WRONG Examples

```tsx
// WRONG: page calling fetch directly (skips all layers)
function DashboardPage() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("/api/dashboard").then(r => r.json()).then(setData);
  }, []);
}

// WRONG: store calling API directly (skips use case layer)
const useEmployeesStore = create((set) => ({
  loadEmployees: async () => {
    set({ isLoading: true });
    try {
      const response = await fetchAdminEmployees({ page: 1, limit: 20 });
      set({ employees: response.data, isLoading: false });
    } catch (error) {
      // Business logic leaked into store: error classification, message resolution
      set({ error: resolveErrorMessage(error, "Erro"), isAuthError: isAuthError(error) });
    }
  },
}));

// WRONG: hardcoded Portuguese strings in store/use-case
set({ error: "Erro ao carregar funcionários" }); // should use MESSAGES.adminEmployees.loadError

// WRONG: business logic inside a React component
function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const hoursUntil = (new Date(appointment.date).getTime() - Date.now()) / 3600000;
  const canCancel = hoursUntil >= 1 && appointment.status === "scheduled";
}

// WRONG: trivial passthrough handler in page
const handleSave = async () => { await saveEmployee(); };
<DsButton onClick={handleSave}>Salvar</DsButton>
// CORRECT: bind directly
<DsButton onClick={saveEmployee}>Salvar</DsButton>

// WRONG: lib/ importing from stores (inverted dependency)
// src/lib/sign-out.ts
import { useAuthStore } from "@/stores/auth-store"; // FORBIDDEN in lib layer
```

### CORRECT Examples

```tsx
// CORRECT: page → store → use case → api (full layer chain)

// src/api/admin-employees-api.ts — Pure HTTP wrapper
async function fetchAdminEmployees(params: ListAdminEmployeesParams): Promise<AdminEmployeesResponse> {
  return httpAuthGet<AdminEmployeesResponse>(`/employees?${buildSearchParams(params)}`);
}

// src/use-cases/load-admin-employees.ts — Business logic + error handling
async function loadAdminEmployees(input: LoadAdminEmployeesInput): Promise<AdminEmployeesLoadResult> {
  try {
    const response = await fetchAdminEmployees(buildParams(input));
    return { data: { employees: response.data, total: response.total }, error: null, isAuthError: false };
  } catch (error) {
    return { data: null, error: resolveErrorMessage(error, MESSAGES.adminEmployees.loadError), isAuthError: isAuthError(error) };
  }
}

// src/stores/admin-employees-store.ts — Thin state container
loadEmployees: async () => {
  set({ isLoading: true, error: null });
  const result = await loadAdminEmployees({ page, limit, status, search });
  if (result.data) set({ employees: result.data.employees, isLoading: false });
  else set({ error: result.error, isAuthError: result.isAuthError, isLoading: false });
},

// src/app/admin/funcionarios/page.tsx — Thin UI
const { employees, isLoading, loadEmployees } = useAdminEmployeesStore();
useEffect(() => { waitForAuthHydration().then(() => loadEmployees()); }, [loadEmployees]);

// CORRECT: business logic in domain layer, consumed by use case
// src/lib/appointment-rules.ts
function canCancelAppointment(appointment: Appointment): boolean { /* ... */ }

// CORRECT: shared use case eliminates duplication
// src/use-cases/load-employee-busy-dates.ts — used by both admin-employee-edit-store AND admin-employee-schedule-store
async function loadEmployeeBusyDates(input: LoadBusyDatesInput): Promise<Date[]> { /* ... */ }
```

### Why this matters

| Benefit | How Clean Architecture achieves it |
|---|---|
| **UI Independence** | Business logic works regardless of React, Next.js, or any UI framework |
| **Testability** | Use cases can be unit tested without rendering components or mocking stores |
| **Maintainability** | Changing the HTTP client or API provider only touches `src/api/` |
| **No duplication** | Shared use cases (e.g., `loadEmployeeBusyDates`) are reused across stores |
| **Consistent errors** | All error handling lives in use cases, all strings in `MESSAGES` |
| **Team scalability** | Developers can work on different layers in parallel without conflicts |
| **Refactoring safety** | Replacing Zustand only touches `src/stores/` — use cases and API are unaffected |

### Checklist for every feature

- [ ] Domain types defined in `src/types/` or `src/lib/`
- [ ] Business rules as pure functions in `src/lib/`
- [ ] User-facing strings added to `src/lib/messages.ts` (NEVER hardcoded)
- [ ] API function (one per endpoint) in `src/api/` — pure HTTP, no logic
- [ ] Use case in `src/use-cases/` — orchestrates API calls, handles errors, returns typed result
- [ ] Store action delegates to use case — thin, no try/catch, no error classification
- [ ] Page/component is thin — only composes DS + connects to store
- [ ] No layer imports from a layer above it
- [ ] Shared logic extracted into reusable use cases (not duplicated across stores)
- [ ] Loading and error states handled in the store from use case results

---

## 15. SOLID — Principles in the Frontend

### S — Single Responsibility Principle (SRP)

Each unit has ONE responsibility:

| Unit | Responsibility |
|---|---|
| DS Component | Render pure UI, no business logic |
| Page (`page.tsx`) | Compose components and connect to store |
| `_components/*` | Isolated page section |
| Store (Zustand) | Thin state container for ONE domain — delegates to use cases |
| Use case (`use-cases/`) | ONE business operation — orchestrate API, handle errors, transform data |
| API function (`api/`) | ONE HTTP call for ONE endpoint — no logic |
| Utility (`lib/`) | ONE transformation or calculation |
| Messages (`lib/messages.ts`) | ALL user-facing strings — single source of truth |

```tsx
// WRONG: store does everything (API calls + error handling + business logic)
const useEmployeeStore = create((set) => ({
  loadEmployee: async (id) => {
    try {
      const [employee, units] = await Promise.all([fetchEmployee(id), fetchUnits()]);
      // data mapping, error classification, toast triggers — ALL leaked into store
    } catch (error) { /* ... */ }
  },
}));

// CORRECT: responsibilities split across layers
// src/use-cases/load-admin-employee-detail.ts → orchestration + error handling
// src/stores/admin-employee-edit-store.ts     → thin state from use case result
```

```tsx
// WRONG: store does everything (auth + dashboard + services)
const useAppStore = create((set) => ({
  user: null, services: [], payments: [],
  login: async () => { /* ... */ },
  fetchServices: async () => { /* ... */ },
  fetchPayments: async () => { /* ... */ },
}));

// CORRECT: stores separated by domain
// src/stores/auth-store.ts     → authentication state
// src/stores/dashboard-store.ts → dashboard data
// src/stores/login-store.ts    → login flow
```

### O — Open/Closed Principle (OCP)

DS components are **open for extension** (new optional props) and **closed for modification** (don't change existing behavior).

Use cases follow OCP by returning typed results that stores interpret — adding new error types or data fields doesn't require modifying the store.

```tsx
// CORRECT: extend DsButton with new variant without breaking existing ones
// Before: variant = "primary" | "secondary" | "ghost"
// After:  variant = "primary" | "secondary" | "ghost" | "danger"
// Existing props keep working the same

// CORRECT: extend use case result without modifying stores
// Before: { data, error, isAuthError }
// After:  { data, error, isAuthError, retryable } — stores that don't use retryable still work

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

Stores, use case results, and prop interfaces must be focused — consumers use only what they need.

```tsx
// CORRECT: segregated stores, each with minimal interface
const { accessToken } = useAuthStore();           // only needs the token
const { summary, isLoading } = useDashboardStore(); // only needs the summary

// CORRECT: use case returns only what the store needs
interface AdminEmployeesLoadResult {
  data: { employees: AdminEmployee[]; total: number } | null;
  error: string | null;
  isAuthError: boolean;
}

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

Upper layers depend on abstractions (interfaces/typed results), not implementation details. The key chain: Page → Store → Use Case → API → HTTP Client.

```tsx
// CORRECT: page depends on store (abstraction), not on use-cases or API
function DashboardPage() {
  const { summary } = useDashboardStore(); // doesn't know where data comes from
}

// CORRECT: store depends on use case (abstraction), not on raw API calls
loadEmployees: async () => {
  const result = await loadAdminEmployees(input); // abstraction
  if (result.data) set({ employees: result.data.employees });
},

// CORRECT: use case depends on API function, not on raw fetch
async function loadAdminEmployees(input) {
  const response = await fetchAdminEmployees(params); // abstraction
  return { data: { employees: response.data, total: response.total } };
}

// CORRECT: API encapsulates HTTP details
async function fetchAdminEmployees(params) {
  return httpAuthGet<AdminEmployeesResponse>(`/employees?${searchParams}`);
}

// WRONG: store calling API directly (skips use case abstraction)
loadEmployees: async () => {
  const response = await fetchAdminEmployees({ page: 1, limit: 20 });
  set({ employees: response.data });
},

// WRONG: store knows HTTP/error implementation details
loadEmployees: async () => {
  try {
    const res = await fetch("/employees", { headers: { Authorization: `Bearer ${token}` } });
    set({ employees: await res.json() });
  } catch (e) { /* error classification leaked into store */ }
},
```

### Practical summary

| Principle | Frontend rule |
|---|---|
| **SRP** | 1 component/file, 1 store/domain, 1 use-case/action, 1 api-fn/endpoint |
| **OCP** | Extend DS with optional props, extend use case results without modifying stores |
| **LSP** | DS components with same interface behave consistently |
| **ISP** | Stores focused per domain, use case results minimal, props optional when possible |
| **DIP** | Page → Store → Use Case → API → HTTP Client (each layer abstracts the next) |
