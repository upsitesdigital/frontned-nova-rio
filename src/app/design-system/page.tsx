"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  BellIcon,
  BroomIcon,
  CalendarBlankIcon,
  ClockIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  DeviceMobileCameraIcon,
  PixLogoIcon,
  EyeIcon,
  FileCsvIcon,
  FloppyDiskIcon,
  GearIcon,
  HammerIcon,
  HourglassIcon,
  CheckCircleIcon,
  XIcon,
  HouseIcon,
  LockIcon,
  NoteIcon,
  PencilIcon,
  QrCodeIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CurrencyDollarSimpleIcon,
  PlusIcon,
  SignOutIcon,
  StarFourIcon,
  TrashIcon,
  UsersIcon,
  UsersThreeIcon,
  MapPinIcon,
  UserIcon,
  UserCircleCheckIcon,
  EnvelopeSimpleIcon,
  LockKeyOpenIcon,
} from "@phosphor-icons/react";
import {
  DsButton,
  DsIconButton,
  DsInput,
  DsPasswordInput,
  DsTextarea,
  DsLabel,
  DsSelect,
  DsCheckbox,
  DsSwitch,
  DsBadge,
  DsSeparator,
  DsSkeleton,
  DsTooltip,
  DsScrollArea,
  DsIcon,
  DsAvatar,
  DsStatCard,
  DsDataTable,
  DsCreditCardDisplay,
  DsDateBadge,
  DsEmptyState,
  DsNotificationBell,
  DsFormField,
  DsFormGroup,
  DsDatePicker,
  DsFilterDropdown,
  DsSearchInput,
  DsCard,
  DsSectionHeader,
  DsPageContainer,
  DsSection,
  DsDialog,
  DsConfirmDialog,
  DsSheet,
  DsStepper,
  DsServiceOptionCard,
  DsRadioOptionCard,
  DsConfigSection,
  DsInfoPanel,
  DsFlowCard,
  DsFlowHeader,
  DsPopup,
  DsTimeSlotPicker,
  DsDateTimePicker,
  DsPaymentMethodOption,
  DsSecurePaymentBanner,
  DsAuthLayout,
  DsSidebar,
  DsSidebarItem,
  DsLogo,
  DsDiscountCard,
  DsSavedCardItem,
  DsSavedCardList,
  DsStatusPill,
  DsTransactionTable,
  DsTransactionCard,
  DsReceiptButton,
  DsHighlightCard,
  DsServiceHistoryItem,
  DsRegisteredCardItem,
  DsRegisteredCardList,
  DsRecentPaymentItem,
  DsServiceDetailPopup,
  DsServiceDetailRow,
  DsUpcomingServiceCard,
  DsRecurrenceCard,
  DsPaymentInfoCard,
  DsCollapsibleSection,
  DsUserMenu,
  DsUserMenuItem,
  DsAdminSidebar,
  DsProfileCard,
} from "@/design-system";

const selectOptions = [
  { value: "cleaning", label: "Cleaning" },
  { value: "laundry", label: "Laundry" },
  { value: "cooking", label: "Cooking" },
];

const tableColumns = [
  { key: "name", header: "Name" },
  { key: "service", header: "Service" },
  { key: "date", header: "Date" },
  { key: "status", header: "Status" },
];

const tableData = [
  { name: "Maria Silva", service: "Cleaning", date: "2026-02-27", status: "Completed" },
  { name: "Ana Costa", service: "Laundry", date: "2026-02-28", status: "Pending" },
  { name: "Carlos Lima", service: "Cooking", date: "2026-03-01", status: "Scheduled" },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 border-b pb-2 text-xl font-semibold">{children}</h2>;
}

function ComponentRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export default function DesignSystemPage() {
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [selectValue, setSelectValue] = useState("");
  const [dateValue, setDateValue] = useState<Date | undefined>(undefined);
  const [filterValue, setFilterValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [stepperStep, setStepperStep] = useState(0);
  const [selectedService, setSelectedService] = useState(0);
  const [selectedRecurrence, setSelectedRecurrence] = useState<string | null>("recorrencia");
  const [recurrenceType, setRecurrenceType] = useState("mensal");
  const [pickerDate, setPickerDate] = useState<Date | undefined>(undefined);
  const [pickerTime, setPickerTime] = useState<string | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [selectedCard, setSelectedCard] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [txFilter, setTxFilter] = useState("todos");
  const [historyFilter, setHistoryFilter] = useState("recentes");

  return (
    <DsPageContainer className="py-10">
      <DsSection>
        <h1 className="text-3xl font-bold">Nova Rio Design System</h1>
        <p className="text-muted-foreground">Component showcase and demonstration page.</p>
      </DsSection>

      <DsSeparator className="my-8" />

      {/* ───── PRIMITIVES ───── */}
      <DsSection>
        <SectionTitle>Primitives</SectionTitle>

        <ComponentRow label="DsButton — Variants">
          <DsButton variant="default">Default</DsButton>
          <DsButton variant="secondary">Secondary</DsButton>
          <DsButton variant="outline">Outline</DsButton>
          <DsButton variant="ghost">Ghost</DsButton>
          <DsButton variant="destructive">Destructive</DsButton>
          <DsButton variant="link">Link</DsButton>
          <DsButton disabled>Disabled</DsButton>
        </ComponentRow>

        <ComponentRow label="DsButton — Sizes">
          <DsButton size="xs">Extra Small</DsButton>
          <DsButton size="sm">Small</DsButton>
          <DsButton size="default">Default</DsButton>
          <DsButton size="lg">Large</DsButton>
        </ComponentRow>

        <ComponentRow label="DsIconButton">
          <DsIconButton icon={PencilIcon} ariaLabel="Edit" variant="default" />
          <DsIconButton icon={TrashIcon} ariaLabel="Delete" variant="destructive" />
          <DsIconButton icon={GearIcon} ariaLabel="Settings" variant="outline" />
          <DsIconButton icon={HouseIcon} ariaLabel="Home" variant="ghost" />
          <DsIconButton icon={PencilIcon} ariaLabel="Edit small" variant="outline" size="icon-sm" />
          <DsIconButton icon={PencilIcon} ariaLabel="Edit xs" variant="outline" size="icon-xs" />
        </ComponentRow>

        <ComponentRow label="DsInput">
          <DsInput placeholder="Type something..." className="max-w-xs" />
          <DsInput placeholder="Disabled" disabled className="max-w-xs" />
        </ComponentRow>

        <ComponentRow label="DsPasswordInput">
          <DsPasswordInput placeholder="Enter password..." className="max-w-xs" />
        </ComponentRow>

        <ComponentRow label="DsTextarea">
          <DsTextarea placeholder="Write a message..." className="max-w-sm" />
        </ComponentRow>

        <ComponentRow label="DsLabel">
          <DsLabel>Full name</DsLabel>
          <DsLabel>Email address</DsLabel>
        </ComponentRow>

        <ComponentRow label="DsSelect">
          <DsSelect
            options={selectOptions}
            placeholder="Choose a service"
            value={selectValue}
            onValueChange={setSelectValue}
            className="w-[200px]"
          />
          <DsSelect
            options={selectOptions}
            placeholder="Disabled select"
            disabled
            className="w-[200px]"
          />
        </ComponentRow>

        <ComponentRow label="DsCheckbox">
          <div className="flex items-center gap-2">
            <DsCheckbox
              id="demo-checkbox"
              checked={checkboxChecked}
              onCheckedChange={setCheckboxChecked}
            />
            <DsLabel htmlFor="demo-checkbox">Accept terms</DsLabel>
          </div>
          <div className="flex items-center gap-2">
            <DsCheckbox disabled checked />
            <DsLabel>Disabled checked</DsLabel>
          </div>
        </ComponentRow>

        <ComponentRow label="DsSwitch">
          <div className="flex items-center gap-2">
            <DsSwitch id="demo-switch" checked={switchChecked} onCheckedChange={setSwitchChecked} />
            <DsLabel htmlFor="demo-switch">Notifications</DsLabel>
          </div>
          <div className="flex items-center gap-2">
            <DsSwitch disabled />
            <DsLabel>Disabled</DsLabel>
          </div>
        </ComponentRow>

        <ComponentRow label="DsBadge — Variants">
          <DsBadge variant="default">Default</DsBadge>
          <DsBadge variant="secondary">Secondary</DsBadge>
          <DsBadge variant="destructive">Destructive</DsBadge>
          <DsBadge variant="outline">Outline</DsBadge>
        </ComponentRow>

        <ComponentRow label="DsSkeleton">
          <DsSkeleton className="h-4 w-32" />
          <DsSkeleton className="h-8 w-8 rounded-full" />
          <DsSkeleton className="h-20 w-48" />
        </ComponentRow>

        <ComponentRow label="DsTooltip">
          <DsTooltip content="This is a tooltip!">
            <DsButton variant="outline">Hover me</DsButton>
          </DsTooltip>
          <DsTooltip content="Bottom tooltip" side="bottom">
            <DsButton variant="outline">Bottom</DsButton>
          </DsTooltip>
        </ComponentRow>

        <ComponentRow label="DsScrollArea">
          <DsScrollArea className="h-32 w-64 rounded-md border p-3">
            <div className="space-y-2">
              {Array.from({ length: 15 }, (_, i) => (
                <p key={i} className="text-sm">
                  Scroll item {i + 1}
                </p>
              ))}
            </div>
          </DsScrollArea>
        </ComponentRow>
      </DsSection>

      <DsSeparator className="my-8" />

      {/* ───── MEDIA ───── */}
      <DsSection>
        <SectionTitle>Media — Phosphor Icons</SectionTitle>

        <ComponentRow label="DsIcon — Sizes">
          <DsIcon icon={HouseIcon} size="xs" />
          <DsIcon icon={HouseIcon} size="sm" />
          <DsIcon icon={HouseIcon} size="md" />
          <DsIcon icon={HouseIcon} size="lg" />
          <DsIcon icon={HouseIcon} size="xl" />
        </ComponentRow>

        <ComponentRow label="DsIcon — Weights">
          <DsIcon icon={HouseIcon} size="lg" weight="thin" />
          <DsIcon icon={HouseIcon} size="lg" weight="light" />
          <DsIcon icon={HouseIcon} size="lg" weight="regular" />
          <DsIcon icon={HouseIcon} size="lg" weight="bold" />
          <DsIcon icon={HouseIcon} size="lg" weight="fill" />
          <DsIcon icon={HouseIcon} size="lg" weight="duotone" />
        </ComponentRow>

        <ComponentRow label="DsIcon — Available Icons">
          <DsIcon icon={BellIcon} size="md" />
          <DsIcon icon={BroomIcon} size="md" />
          <DsIcon icon={CalendarBlankIcon} size="md" />
          <DsIcon icon={ClockIcon} size="md" />
          <DsIcon icon={CreditCardIcon} size="md" />
          <DsIcon icon={CurrencyDollarIcon} size="md" />
          <DsIcon icon={EyeIcon} size="md" />
          <DsIcon icon={FileCsvIcon} size="md" />
          <DsIcon icon={FloppyDiskIcon} size="md" />
          <DsIcon icon={GearIcon} size="md" />
          <DsIcon icon={HourglassIcon} size="md" />
          <DsIcon icon={HouseIcon} size="md" />
          <DsIcon icon={LockIcon} size="md" />
          <DsIcon icon={NoteIcon} size="md" />
          <DsIcon icon={PencilIcon} size="md" />
          <DsIcon icon={QrCodeIcon} size="md" />
          <DsIcon icon={SignOutIcon} size="md" />
          <DsIcon icon={StarFourIcon} size="md" />
          <DsIcon icon={TrashIcon} size="md" />
          <DsIcon icon={UsersIcon} size="md" />
          <DsIcon icon={UsersThreeIcon} size="md" />
        </ComponentRow>
      </DsSection>

      <DsSeparator className="my-8" />

      {/* ───── DATA DISPLAY ───── */}
      <DsSection>
        <SectionTitle>Data Display</SectionTitle>

        <ComponentRow label="DsStatCard">
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
            <DsStatCard
              title="Total Bookings"
              value={142}
              icon={CalendarBlankIcon}
              trend={{ value: 12, positive: true }}
            />
            <DsStatCard
              title="Revenue"
              value="R$ 24,500"
              icon={CurrencyDollarIcon}
              trend={{ value: 5, positive: true }}
            />
            <DsStatCard
              title="Cancellations"
              value={8}
              icon={HourglassIcon}
              trend={{ value: 3, positive: false }}
            />
          </div>
        </ComponentRow>

        <ComponentRow label="DsCard">
          <DsCard className="max-w-sm p-6">
            <p className="text-sm text-muted-foreground">A simple card wrapper for any content.</p>
          </DsCard>
        </ComponentRow>

        <ComponentRow label="DsAvatar — Sizes">
          <DsAvatar fallback="MS" size="sm" />
          <DsAvatar fallback="AC" size="md" />
          <DsAvatar fallback="CL" size="lg" />
        </ComponentRow>

        <ComponentRow label="DsCreditCardDisplay">
          <DsCreditCardDisplay lastFour="4242" brand="mastercard" />
          <DsCreditCardDisplay lastFour="1234" brand="visa" />
        </ComponentRow>

        <ComponentRow label="DsDateBadge">
          <DsDateBadge date="Feb 27, 2026" />
          <DsDateBadge date="Mar 01, 2026" />
        </ComponentRow>

        <ComponentRow label="DsDataTable">
          <div className="w-full max-w-2xl">
            <DsDataTable columns={tableColumns} data={tableData} />
          </div>
        </ComponentRow>

        <ComponentRow label="DsEmptyState">
          <DsEmptyState
            icon={BroomIcon}
            title="No cleaning scheduled"
            description="Book your first cleaning service to get started."
            action={<DsButton size="sm">Book Now</DsButton>}
          />
        </ComponentRow>
      </DsSection>

      <DsSeparator className="my-8" />

      {/* ───── FORMS ───── */}
      <DsSection>
        <SectionTitle>Forms</SectionTitle>

        <ComponentRow label="DsFormField">
          <DsFormGroup className="w-full max-w-sm">
            <DsFormField label="Full Name" required htmlFor="name">
              <DsInput id="name" placeholder="John Doe" />
            </DsFormField>
            <DsFormField label="Email" error="Invalid email address" htmlFor="email">
              <DsInput id="email" placeholder="john@example.com" type="email" />
            </DsFormField>
            <DsFormField label="Password" required htmlFor="pwd">
              <DsPasswordInput id="pwd" placeholder="Enter password" />
            </DsFormField>
          </DsFormGroup>
        </ComponentRow>

        <ComponentRow label="DsSearchInput">
          <DsSearchInput placeholder="Search bookings..." className="max-w-xs" />
        </ComponentRow>

        <ComponentRow label="DsDatePicker">
          <DsDatePicker
            value={dateValue}
            onChange={setDateValue}
            placeholder="Select a date"
            className="max-w-xs"
          />
        </ComponentRow>

        <ComponentRow label="DsFilterDropdown">
          <DsFilterDropdown
            label="Service Type"
            options={selectOptions}
            value={filterValue}
            onValueChange={setFilterValue}
            placeholder="All services"
            className="w-[200px]"
          />
        </ComponentRow>
      </DsSection>

      <DsSeparator className="my-8" />

      {/* ───── FEEDBACK ───── */}
      <DsSection>
        <SectionTitle>Feedback</SectionTitle>

        <ComponentRow label="DsNotificationBell">
          <DsNotificationBell count={0} />
          <DsNotificationBell count={5} />
          <DsNotificationBell count={150} />
        </ComponentRow>

        <ComponentRow label="DsDialog / DsConfirmDialog / DsSheet">
          <DsButton onClick={() => setDialogOpen(true)}>Open Dialog</DsButton>
          <DsButton variant="destructive" onClick={() => setConfirmOpen(true)}>
            Open Confirm
          </DsButton>
          <DsButton variant="outline" onClick={() => setSheetOpen(true)}>
            Open Sheet
          </DsButton>
        </ComponentRow>

        <DsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="Example Dialog"
          description="This is a demonstration of the DsDialog component."
          footer={<DsButton onClick={() => setDialogOpen(false)}>Close</DsButton>}
        >
          <p className="text-sm text-muted-foreground">
            Dialog body content goes here. Use this for forms, details, or any custom content.
          </p>
        </DsDialog>

        <DsConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Delete booking?"
          description="This action cannot be undone. The booking will be permanently removed."
          variant="destructive"
          confirmLabel="Delete"
          onConfirm={() => setConfirmOpen(false)}
        />

        <DsSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          title="Booking Details"
          description="View and edit booking information."
        >
          <div className="space-y-3 p-4">
            <p className="text-sm">Customer: Maria Silva</p>
            <p className="text-sm">Service: Deep Cleaning</p>
            <p className="text-sm">Date: Feb 27, 2026</p>
          </div>
        </DsSheet>
      </DsSection>

      <DsSeparator className="my-8" />

      {/* ───── LAYOUT ───── */}
      <DsSection>
        <SectionTitle>Layout</SectionTitle>

        <ComponentRow label="DsSectionHeader">
          <div className="w-full rounded-lg border p-4">
            <DsSectionHeader
              title="Recent Bookings"
              description="Overview of all cleaning service bookings"
              action={
                <DsButton size="sm" variant="outline">
                  View All
                </DsButton>
              }
            />
          </div>
        </ComponentRow>

        <ComponentRow label="DsSeparator">
          <div className="w-full max-w-sm space-y-2">
            <p className="text-sm">Above separator</p>
            <DsSeparator />
            <p className="text-sm">Below separator</p>
          </div>
        </ComponentRow>

        <ComponentRow label="DsSidebar + DsSidebarItem — Collapsible">
          <div className="h-[700px] overflow-hidden rounded-lg border transition-all duration-300" style={{ width: sidebarCollapsed ? 88 : 260 }}>
            <DsSidebar collapsed={sidebarCollapsed} className="h-full">
              <div className="flex flex-col gap-14">
                <div className="flex flex-col gap-12 border-b border-nova-gray-300 pb-6">
                  <div className="relative flex h-[80px] items-center">
                    {!sidebarCollapsed && <DsLogo />}
                    <DsIconButton
                      icon={sidebarCollapsed ? CaretRightIcon : CaretLeftIcon}
                      ariaLabel={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                      variant="outline"
                      size="icon-sm"
                      className={cn(
                        "size-9 rounded-[10px]",
                        sidebarCollapsed ? "mx-auto" : "absolute right-0 top-[22px]",
                      )}
                      onClick={() => setSidebarCollapsed((c) => !c)}
                    />
                  </div>
                  {!sidebarCollapsed ? (
                    <DsButton className="h-14 w-full gap-1 rounded-xl text-lg tracking-[-0.72px]">
                      <DsIcon icon={PlusIcon} size="md" />
                      Agendar serviço
                    </DsButton>
                  ) : (
                    <DsIconButton
                      icon={PlusIcon}
                      ariaLabel="Agendar serviço"
                      className="mx-auto size-14 rounded-xl"
                    />
                  )}
                </div>
                <nav className="flex flex-col gap-2">
                  <DsSidebarItem icon={HouseIcon} label="Minha Área" active collapsed={sidebarCollapsed} href="#" />
                  <DsSidebarItem icon={BroomIcon} label="Meus serviços" collapsed={sidebarCollapsed} href="#" />
                  <DsSidebarItem icon={CurrencyDollarSimpleIcon} label="Pagamentos" collapsed={sidebarCollapsed} href="#" />
                </nav>
              </div>
              <DsSidebarItem icon={SignOutIcon} label="Sair" collapsed={sidebarCollapsed} />
            </DsSidebar>
          </div>
        </ComponentRow>

        <ComponentRow label="DsAdminSidebar — Admin Navigation">
          <div className="h-[900px] overflow-hidden rounded-lg border">
            <DsAdminSidebar activePath="/admin" />
          </div>
        </ComponentRow>
      </DsSection>

      <DsSeparator className="my-8" />

      {/* ───── COMPOSITE ───── */}
      <DsSection>
        <SectionTitle>Composite</SectionTitle>

        <ComponentRow label="DsStepper — Interactive">
          <div className="w-full max-w-2xl space-y-4">
            <DsStepper
              steps={[
                { label: "Agendar serviço" },
                { label: "Dia e horário" },
                { label: "Pagamento" },
              ]}
              currentStep={stepperStep}
            />
            <div className="flex gap-2">
              <DsButton
                size="sm"
                variant="outline"
                onClick={() => setStepperStep((s) => Math.max(0, s - 1))}
                disabled={stepperStep === 0}
              >
                Previous
              </DsButton>
              <DsButton
                size="sm"
                onClick={() => setStepperStep((s) => Math.min(2, s + 1))}
                disabled={stepperStep === 2}
              >
                Next
              </DsButton>
            </div>
          </div>
        </ComponentRow>

        <ComponentRow label="DsServiceOptionCard — Selectable">
          <div className="flex w-full max-w-3xl gap-4">
            <DsServiceOptionCard
              icon={BroomIcon}
              title="Faxina Regular"
              description="Limpeza completa e manutenção periódica"
              price="A partir de R$ 50,00"
              selected={selectedService === 0}
              onClick={() => setSelectedService(0)}
            />
            <DsServiceOptionCard
              icon={StarFourIcon}
              title="Faxina Premium"
              description="Limpeza completa e manutenção periódica"
              price="A partir de R$ 50,00"
              selected={selectedService === 1}
              onClick={() => setSelectedService(1)}
            />
            <DsServiceOptionCard
              icon={HammerIcon}
              title="Faxina Pós-Obra"
              description="Limpeza especializada após construção"
              price="A partir de R$ 50,00"
              selected={selectedService === 2}
              onClick={() => setSelectedService(2)}
            />
          </div>
        </ComponentRow>

        <ComponentRow label="DsRadioOptionCard — With Badge">
          <div className="flex gap-3">
            <DsRadioOptionCard
              label="Avulso"
              selected={selectedRecurrence === "avulso"}
              onClick={() => setSelectedRecurrence("avulso")}
            />
            <DsRadioOptionCard
              label="Pacote"
              selected={selectedRecurrence === "pacote"}
              onClick={() => setSelectedRecurrence("pacote")}
            />
            <DsRadioOptionCard
              label="Recorrência"
              badge="5% OFF"
              selected={selectedRecurrence === "recorrencia"}
              onClick={() => setSelectedRecurrence("recorrencia")}
            />
          </div>
        </ComponentRow>

        <ComponentRow label="DsConfigSection + DsInfoPanel — Recurrence Config">
          <DsConfigSection
            title="Configurar Recorrência"
            subtitle="Escolha como deseja agendar seus serviços de limpeza"
            className="w-full max-w-3xl"
          >
            <div className="flex gap-3">
              <DsRadioOptionCard
                label="Avulso"
                selected={selectedRecurrence === "avulso"}
                onClick={() => setSelectedRecurrence("avulso")}
              />
              <DsRadioOptionCard
                label="Pacote"
                selected={selectedRecurrence === "pacote"}
                onClick={() => setSelectedRecurrence("pacote")}
              />
              <DsRadioOptionCard
                label="Recorrência"
                badge="5% OFF"
                selected={selectedRecurrence === "recorrencia"}
                onClick={() => setSelectedRecurrence("recorrencia")}
              />
            </div>
            {selectedRecurrence === "recorrencia" && (
              <DsInfoPanel>
                <div className="flex w-full max-w-[391px] flex-col gap-1.5">
                  <span className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
                    Selecione o tipo de recorrência
                  </span>
                  <DsSelect
                    options={[
                      { value: "mensal", label: "Mensal" },
                      { value: "quinzenal", label: "Quinzenal" },
                      { value: "semanal", label: "Semanal" },
                    ]}
                    value={recurrenceType}
                    onValueChange={setRecurrenceType}
                    className="h-auto! w-full border-nova-gray-100 bg-white px-4 py-3 text-base shadow-none"
                  />
                </div>
                <p className="text-xs leading-[1.3] tracking-[-0.48px] text-nova-gray-700">
                  <span className="font-bold">5%</span> de desconto para recorrências mensais e{" "}
                  <span className="font-bold">10%</span> para semanais e quinzenais.
                </p>
              </DsInfoPanel>
            )}
          </DsConfigSection>
        </ComponentRow>

        <ComponentRow label="DsInfoPanel — Standalone">
          <DsInfoPanel className="max-w-md">
            <p className="text-sm text-nova-gray-700">
              This is a standalone info panel for contextual content, tips, or secondary controls.
            </p>
          </DsInfoPanel>
        </ComponentRow>

        <ComponentRow label="DsFlowCard + DsFlowHeader — Registration Form">
          <div className="w-full max-w-3xl">
            <DsFlowCard>
              <DsFlowHeader
                title="Cadastrar e-mail"
                subtitle="Cadastre seu e-mail para prosseguir com o pagamento."
              />
              <div className="flex w-full max-w-[589px] flex-col gap-4">
                <DsFormField label="Nome" htmlFor="flow-name">
                  <DsInput id="flow-name" placeholder="Digite seu Nome" />
                </DsFormField>
                <DsFormField label="E-mail" htmlFor="flow-email">
                  <DsInput id="flow-email" placeholder="Digite seu e-mail" type="email" />
                </DsFormField>
                <DsFormField label="Telefone" htmlFor="flow-phone">
                  <DsInput id="flow-phone" placeholder="Digite seu telefone" />
                </DsFormField>
                <DsFormField label="Senha" htmlFor="flow-pwd">
                  <DsPasswordInput id="flow-pwd" placeholder="Digite sua senha" />
                </DsFormField>
              </div>
              <DsButton size="flow">Cadastrar e-mail</DsButton>
            </DsFlowCard>
            <div className="mt-6">
              <DsButton size="flow" variant="outline">
                Voltar
              </DsButton>
            </div>
          </div>
        </ComponentRow>

        <ComponentRow label="DsButton — Flow Size">
          <DsButton size="flow">Primary Flow</DsButton>
          <DsButton size="flow" variant="outline">
            Outline Flow
          </DsButton>
          <DsButton size="flow" disabled>
            Disabled Flow
          </DsButton>
        </ComponentRow>

        <ComponentRow label="DsTimeSlotPicker — Standalone">
          <DsTimeSlotPicker
            slots={["07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00"]}
            value={pickerTime}
            onChange={setPickerTime}
          />
        </ComponentRow>

        <ComponentRow label="DsDateTimePicker — Calendar + Time Slots">
          <DsDateTimePicker
            date={pickerDate}
            time={pickerTime}
            onDateChange={setPickerDate}
            onTimeChange={setPickerTime}
            onCancel={() => {
              setPickerDate(undefined);
              setPickerTime(undefined);
            }}
            onConfirm={() => alert(`Selected: ${pickerDate?.toLocaleDateString()} ${pickerTime}`)}
          />
        </ComponentRow>

        <ComponentRow label="DsPaymentMethodOption — Payment Method Section">
          <DsConfigSection
            title="Método de pagamento"
            subtitle="Escolha como deseja pagar pelo serviço"
            className="w-full max-w-3xl"
          >
            <div className="flex w-full flex-col gap-3">
              <DsPaymentMethodOption
                icon={CreditCardIcon}
                label="Cartão de crédito"
                description="Visa, Mastercard, Elo"
                selected={paymentMethod === "credit"}
                onClick={() => setPaymentMethod("credit")}
              />
              <DsPaymentMethodOption
                icon={PixLogoIcon}
                label="Pix"
                description="Pagamento instantâneo"
                selected={paymentMethod === "pix"}
                onClick={() => setPaymentMethod("pix")}
              />
              <DsPaymentMethodOption
                icon={DeviceMobileCameraIcon}
                label="Cartão de débito"
                description="Débito em conta"
                selected={paymentMethod === "debit"}
                onClick={() => setPaymentMethod("debit")}
              />
            </div>
          </DsConfigSection>
        </ComponentRow>

        <ComponentRow label="DsAuthLayout — Create Account Page">
          <div className="w-full max-w-4xl rounded-lg border">
            <DsAuthLayout className="min-h-0 py-8">
              <h2 className="text-center text-4xl font-medium leading-[1.3] tracking-[-1.44px] text-black">
                Crie sua conta
              </h2>
              <div className="flex w-full flex-col gap-4">
                <DsFormField label="Nome" htmlFor="auth-name">
                  <DsInput id="auth-name" placeholder="Digite seu Nome" />
                </DsFormField>
                <DsFormField label="E-mail" htmlFor="auth-email">
                  <DsInput id="auth-email" placeholder="Digite seu e-mail" type="email" />
                </DsFormField>
                <DsFormField label="Telefone" htmlFor="auth-phone">
                  <DsInput id="auth-phone" placeholder="Digite seu telefone" />
                </DsFormField>
                <DsFormField label="Senha" htmlFor="auth-pwd">
                  <DsPasswordInput id="auth-pwd" placeholder="Digite sua senha" />
                </DsFormField>
                <DsFormField label="Confirmar senha" htmlFor="auth-pwd-confirm">
                  <DsPasswordInput id="auth-pwd-confirm" placeholder="Confirme sua senha" />
                </DsFormField>
              </div>
              <div className="flex flex-col items-center gap-6">
                <DsButton size="flow" className="w-[257px]">
                  Criar conta
                </DsButton>
                <p className="text-base leading-normal text-[#4d4d4f]">
                  Já possui uma conta?{" "}
                  <a href="#" className="text-primary underline">
                    Entre aqui
                  </a>
                </p>
              </div>
            </DsAuthLayout>
          </div>
        </ComponentRow>

        <ComponentRow label="DsSavedCardList + DsSavedCardItem">
          <DsSavedCardList className="w-full max-w-lg">
            <DsSavedCardItem
              lastFour="0123"
              expiration="01/30"
              brand="mastercard"
              selected={selectedCard === 0}
              onSelect={() => setSelectedCard(0)}
              onRemove={() => alert("Remove card 1")}
            />
            <DsSavedCardItem
              lastFour="4567"
              expiration="06/28"
              brand="mastercard"
              selected={selectedCard === 1}
              onSelect={() => setSelectedCard(1)}
              onRemove={() => alert("Remove card 2")}
            />
          </DsSavedCardList>
        </ComponentRow>

        <ComponentRow label="DsDiscountCard">
          <DsDiscountCard className="w-full max-w-lg">
            <p>
              Agende agora serviços recorrentes semanais e ganhe{" "}
              <span className="font-semibold">10% de desconto</span>
            </p>
          </DsDiscountCard>
        </ComponentRow>

        <ComponentRow label="DsStatusPill — Variants">
          <DsStatusPill icon={HourglassIcon} label="Pendente" variant="pending" />
          <DsStatusPill icon={XIcon} label="Cancelado" variant="cancelled" />
          <DsStatusPill icon={CheckCircleIcon} label="Aprovado" variant="approved" />
        </ComponentRow>

        <ComponentRow label="DsTransactionCard + DsTransactionTable">
          <DsTransactionCard
            title="Histórico completo de transações"
            action={
              <DsFilterDropdown
                label="Filtrar por"
                options={[
                  { value: "todos", label: "Todos" },
                  { value: "aprovado", label: "Aprovado" },
                  { value: "pendente", label: "Pendente" },
                  { value: "cancelado", label: "Cancelado" },
                ]}
                value={txFilter}
                onValueChange={setTxFilter}
                placeholder="Todos"
              />
            }
            className="w-full"
          >
            <DsTransactionTable
              columns={[
                { key: "date", header: "Data" },
                { key: "service", header: "Serviço" },
                { key: "method", header: "Método" },
                { key: "status", header: "Status" },
                { key: "value", header: "Valor" },
                { key: "receipt", header: "Recibo" },
              ]}
              data={[
                {
                  date: <span className="text-base leading-normal tracking-[-0.64px] text-[#4d4d4f]">25/09/2025</span>,
                  service: <span className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-[#4d4d4f]">Faxina Pós-Obra</span>,
                  method: <span className="text-base leading-normal tracking-[-0.64px] text-[#4d4d4f]">PIX</span>,
                  status: <DsStatusPill icon={HourglassIcon} label="Pendente" variant="pending" />,
                  value: <span className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-[#4d4d4f]">R$ 53,00</span>,
                  receipt: <DsReceiptButton disabled />,
                },
                {
                  date: <span className="text-base leading-normal tracking-[-0.64px] text-[#4d4d4f]">25/09/2025</span>,
                  service: <span className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-[#4d4d4f]">Faxina Pós-Obra</span>,
                  method: <span className="text-base leading-normal tracking-[-0.64px] text-[#4d4d4f]">PIX</span>,
                  status: <DsStatusPill icon={XIcon} label="Cancelado" variant="cancelled" />,
                  value: <span className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-[#4d4d4f]">R$ 57,00</span>,
                  receipt: <DsReceiptButton disabled />,
                },
                {
                  date: <span className="text-base leading-normal tracking-[-0.64px] text-[#4d4d4f]">25/09/2025</span>,
                  service: <span className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-[#4d4d4f]">Limpeza Residencial</span>,
                  method: <span className="text-base leading-normal tracking-[-0.64px] text-[#4d4d4f]">Cartão</span>,
                  status: <DsStatusPill icon={CheckCircleIcon} label="Aprovado" variant="approved" />,
                  value: <span className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-[#4d4d4f]">R$ 120,00</span>,
                  receipt: <DsReceiptButton />,
                },
              ]}
            />
          </DsTransactionCard>
        </ComponentRow>

        <ComponentRow label="DsHighlightCard">
          <div className="flex gap-4">
            <DsHighlightCard
              title="Próximo serviço"
              value="16/10"
              subtitle="Cancelamento com 1h de antecedência"
              onOptionsClick={() => {}}
              className="w-[502px]"
            />
            <DsHighlightCard
              title="Agendamentos"
              value="12"
              subtitle="Nos últimos 2 meses"
              onOptionsClick={() => {}}
              className="w-[501px]"
            />
          </div>
        </ComponentRow>

        <ComponentRow label="DsUpcomingServiceCard + DsHighlightCard + DsRecurrenceCard">
          <div className="flex flex-col gap-4">
            <DsUpcomingServiceCard
              date="16/10"
              subtitle="Cancelamento com 1h de antecedência"
              onReceipt={() => {}}
              actions={[
                { label: "Reagendar", variant: "filled", onClick: () => {} },
                { label: "Cancelar", variant: "outlined", onClick: () => {} },
              ]}
              className="w-[500px]"
            />
            <DsHighlightCard
              title="Agendamentos"
              value="12"
              subtitle="Nos últimos 2 meses"
              onOptionsClick={() => {}}
              className="w-[501px]"
            />
            <DsRecurrenceCard
              title="Configurar Recorrência"
              description="Escolha como deseja configurar a recorrência dos serviços"
              className="w-[501px]"
            >
              <div className="flex flex-col gap-1.5">
                <p className="text-base leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
                  Selecione o tipo de recorrência
                </p>
                <DsSelect
                  options={[
                    { value: "mensal", label: "Mensal" },
                    { value: "semanal", label: "Semanal" },
                    { value: "quinzenal", label: "Quinzenal" },
                  ]}
                  value={recurrenceType}
                  onValueChange={setRecurrenceType}
                  placeholder="Mensal"
                />
              </div>
              <p className="text-xs leading-[1.3] tracking-[-0.48px] text-nova-gray-700">
                <span className="font-bold">5%</span> de desconto para recorrências mensais e{" "}
                <span className="font-bold">10%</span> para semanais e quinzenais.
              </p>
            </DsRecurrenceCard>
          </div>
        </ComponentRow>

        <ComponentRow label="DsServiceHistoryItem — Histórico de serviços">
          <div className="flex w-[1019px] flex-col gap-6 overflow-clip rounded-[10px] border border-nova-gray-100 bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[20px] font-medium leading-[1.3] text-black">
                Histórico de serviços
              </h3>
              <DsFilterDropdown
                label="Filtrar por"
                options={[
                  { value: "recentes", label: "Mais recentes" },
                  { value: "recorrencia", label: "Recorrência" },
                  { value: "avulso", label: "Avulso" },
                ]}
                value={historyFilter}
                onValueChange={setHistoryFilter}
                placeholder="Mais recentes"
              />
            </div>
            <div className="flex flex-col gap-4 rounded-[10px] bg-nova-gray-50 p-6">
              <p className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
                Setembro 2025
              </p>
              <div className="flex flex-col">
                <DsServiceHistoryItem date="30/10" label="Faxina Pós-Obra" onView={() => {}} onEdit={() => {}} />
                <DsServiceHistoryItem date="23/10" label="Faxina Pós-Obra" onView={() => {}} onEdit={() => {}} />
                <DsServiceHistoryItem date="16/10" label="Faxina Pós-Obra" onView={() => {}} onEdit={() => {}} />
                <DsServiceHistoryItem date="25/09" label="Faxina Pós-Obra" onView={() => {}} />
                <DsServiceHistoryItem date="25/09" label="Faxina Pós-Obra" onView={() => {}} />
                <DsServiceHistoryItem date="25/09" label="Faxina Pós-Obra" onView={() => {}} />
              </div>
            </div>
          </div>
        </ComponentRow>

        <ComponentRow label="DsRegisteredCardList — Cartões cadastrados">
          <DsRegisteredCardList onAdd={() => {}} className="w-full max-w-[500px]">
            <DsRegisteredCardItem
              brandSrc="/icons/mastercard.svg"
              lastDigits="0123"
              expiry="01/30"
              onAction={() => {}}
            />
            <DsRegisteredCardItem
              brandSrc="/icons/mastercard.svg"
              lastDigits="0123"
              expiry="01/30"
              onAction={() => {}}
            />
          </DsRegisteredCardList>
        </ComponentRow>

        <ComponentRow label="DsRecentPaymentItem — Pagamentos recentes">
          <div className="flex flex-col gap-6 overflow-clip rounded-[20px] border border-nova-gray-100 bg-white px-6 py-8 w-full max-w-[500px]">
            <p className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-black">
              Pagamentos recentes
            </p>
            <div className="flex flex-col gap-4">
              <p className="text-xs leading-[1.3] tracking-[-0.48px] text-nova-gray-700">
                Este mês
              </p>
              <div className="flex flex-col gap-4 rounded-[10px]">
                <DsRecentPaymentItem
                  icon={CreditCardIcon}
                  method="Terminado em 0123"
                  service="Faxina Regular"
                  amount="R$ 57,00"
                  status="approved"
                  statusLabel="Aprovado"
                />
                <DsRecentPaymentItem
                  icon={CreditCardIcon}
                  method="Terminado em 0123"
                  service="Faxina Pós-Obra"
                  amount="R$ 57,00"
                  status="pending"
                  statusLabel="Pendente"
                />
                <DsRecentPaymentItem
                  icon={PixLogoIcon}
                  method="PIX"
                  service="Faxina Pós-Obra"
                  amount="R$ 53,00"
                  status="pending"
                  statusLabel="Pendente"
                />
              </div>
            </div>
          </div>
        </ComponentRow>

        <ComponentRow label="DsSecurePaymentBanner">
          <DsSecurePaymentBanner className="w-full max-w-3xl" />
        </ComponentRow>

        <ComponentRow label="DsServiceDetailPopup — Service Detail">
          <DsServiceDetailPopup
            icon={BroomIcon}
            serviceName="Faxina Regular"
            date="16/10"
            onClose={() => {}}
            onReceipt={() => {}}
            className="w-[540px]"
          >
            <DsServiceDetailRow>
              <div className="flex items-start gap-2">
                <DsIcon icon={CreditCardIcon} size="lg" className="shrink-0 text-nova-gray-700" />
                <p className="w-[143px] text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
                  Terminado em 0123
                </p>
              </div>
              <div className="flex flex-col items-end leading-[1.3]">
                <p className="text-base font-medium text-nova-gray-700">R$ 57,00</p>
                <p className="text-xs tracking-[-0.48px] text-primary">Aprovado</p>
              </div>
            </DsServiceDetailRow>
            <DsServiceDetailRow>
              <div className="flex items-center gap-2">
                <DsIcon icon={MapPinIcon} size="lg" className="shrink-0 text-nova-gray-700" />
                <p className="text-base font-medium leading-[1.3] tracking-[-0.64px] text-nova-gray-700">
                  Condominio Le Monde
                </p>
              </div>
            </DsServiceDetailRow>
            <DsServiceDetailRow>
              <div className="flex items-center gap-4 text-base font-medium leading-[1.3] tracking-[-0.64px]">
                <span className="text-nova-gray-700">Recorrência</span>
                <span className="text-primary">Avulso</span>
              </div>
            </DsServiceDetailRow>
          </DsServiceDetailPopup>
        </ComponentRow>

        <ComponentRow label="DsPopup — Success Popup">
          <DsButton onClick={() => setPopupOpen(true)}>Open Popup</DsButton>
          <DsPopup open={popupOpen}>
            <div className="flex w-[331px] flex-col items-center gap-4 text-center">
              <h2 className="text-4xl font-medium leading-[1.3] tracking-[-1.44px] text-black">
                E-mail cadastrado com sucesso!
              </h2>
              <p className="text-base leading-normal text-nova-gray-600">
                Prossiga para o pagamento e conclua seu agendamento.
              </p>
            </div>
            <DsButton size="flow" className="w-[305px]" onClick={() => setPopupOpen(false)}>
              Continuar
            </DsButton>
          </DsPopup>
        </ComponentRow>
      </DsSection>

      <DsSection>
        <SectionTitle>New Composite Components</SectionTitle>
        <ComponentRow label="DsPaymentInfoCard — Payment Info">
          <div className="flex w-[400px] flex-col gap-4">
            <DsPaymentInfoCard
              icon={CreditCardIcon}
              description="Terminado em 0123"
              amount="R$ 57,00"
              status="approved"
              statusLabel="Aprovado"
            />
            <DsPaymentInfoCard
              icon={PixLogoIcon}
              description="PIX"
              amount="R$ 53,00"
              status="pending"
              statusLabel="Pendente"
            />
          </div>
        </ComponentRow>

        <ComponentRow label="DsCollapsibleSection — Collapsible">
          <div className="flex w-[400px] flex-col gap-4">
            <DsCollapsibleSection icon={MapPinIcon} title="Condominio Le Monde">
              <p className="text-sm text-nova-gray-700">
                Rua Exemplo, 123 - Bloco A, Apt 101
              </p>
              <p className="text-sm text-nova-gray-700">Barra da Tijuca, Rio de Janeiro</p>
            </DsCollapsibleSection>
            <DsCollapsibleSection
              icon={GearIcon}
              title="Configurações"
              defaultOpen={false}
            >
              <p className="text-sm text-nova-gray-700">Conteúdo recolhido por padrão</p>
            </DsCollapsibleSection>
          </div>
        </ComponentRow>

        <ComponentRow label="DsConfigSection — Borderless Variant">
          <div className="flex gap-6">
            <DsConfigSection
              title="Com Borda"
              subtitle="Variante padrão com borda"
              className="w-[300px]"
            >
              <p className="text-sm text-nova-gray-700">Conteúdo com borda</p>
            </DsConfigSection>
            <DsConfigSection
              bordered={false}
              title="Sem Borda"
              subtitle="Variante sem borda"
              className="w-[300px]"
            >
              <p className="text-sm text-nova-gray-700">Conteúdo sem borda</p>
            </DsConfigSection>
          </div>
        </ComponentRow>

        <ComponentRow label="DsUserMenu + DsUserMenuItem">
          <div className="w-[240px] rounded-lg bg-nova-gray-100 p-4">
            <DsUserMenu>
              <DsUserMenuItem icon={UserIcon} label="Perfil" active />
              <DsUserMenuItem icon={UserCircleCheckIcon} label="Minha conta" />
            </DsUserMenu>
          </div>
        </ComponentRow>

        <ComponentRow label="DsProfileCard — Profile Actions">
          <DsProfileCard
            initials="C"
            name="Caio"
            email="email@example.com"
            actions={[
              { icon: EnvelopeSimpleIcon, label: "Alterar e-mail", onClick: () => {} },
              { icon: LockKeyOpenIcon, label: "Alterar senha", onClick: () => {} },
              { icon: TrashIcon, label: "Deletar conta", variant: "destructive", onClick: () => {} },
            ]}
            className="w-[500px]"
          />
        </ComponentRow>
      </DsSection>

      <div className="h-16" />
    </DsPageContainer>
  );
}
