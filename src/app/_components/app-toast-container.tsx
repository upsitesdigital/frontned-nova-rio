"use client";

import { DsToastContainer } from "@/design-system";
import { useToastStore } from "@/stores/toast-store";

function AppToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return <DsToastContainer toasts={toasts} onRemove={removeToast} />;
}

export { AppToastContainer };
