"use client";

import { useState } from "react";
import {
  BellIcon,
  BroomIcon,
  CalendarBlankIcon,
  ClockIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  EyeIcon,
  FileCsvIcon,
  FloppyDiskIcon,
  GearIcon,
  HourglassIcon,
  HouseIcon,
  LockIcon,
  NoteIcon,
  PencilIcon,
  QrCodeIcon,
  SignOutIcon,
  StarFourIcon,
  TrashIcon,
  UsersIcon,
  UsersThreeIcon,
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
      </DsSection>

      <div className="h-16" />
    </DsPageContainer>
  );
}
