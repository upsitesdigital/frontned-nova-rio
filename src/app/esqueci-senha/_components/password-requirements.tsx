import { Check, X } from "@phosphor-icons/react/dist/ssr";

import { DsIcon } from "@/design-system";
import type { PasswordHint } from "@/validation/reset-password-schema";

interface PasswordRequirementsProps {
  hints: PasswordHint[];
}

function PasswordRequirements({ hints }: PasswordRequirementsProps) {
  if (hints.length === 0) return null;

  return (
    <ul className="flex flex-col gap-1">
      {hints.map((hint) => (
        <li
          key={hint.label}
          className={`flex items-center gap-1.5 text-xs ${
            hint.met ? "text-nova-success" : "text-destructive"
          }`}
        >
          <DsIcon icon={hint.met ? Check : X} size="xs" weight="bold" />
          {hint.label}
        </li>
      ))}
    </ul>
  );
}

export { PasswordRequirements, type PasswordRequirementsProps };
