import { cn } from "@/lib/utils";
import { Check } from "@phosphor-icons/react/dist/ssr";

interface DsStepperStep {
  label: string;
}

interface DsStepperProps {
  steps: DsStepperStep[];
  currentStep: number;
  className?: string;
}

function DsStepper({ steps, currentStep, className }: DsStepperProps) {
  return (
    <div className={cn("flex items-center gap-8", className)}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div key={step.label} className="contents">
            <div className="flex shrink-0 items-center gap-3">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border text-base font-medium leading-[1.3] tracking-[-0.64px]",
                  isActive && "border-primary bg-primary text-primary-foreground",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  !isActive && !isCompleted && "border-nova-gray-300 text-nova-gray-700",
                )}
              >
                {isCompleted ? <Check size={16} weight="bold" /> : index + 1}
              </div>
              <span
                className={cn(
                  "whitespace-nowrap text-base font-medium leading-[1.3] tracking-[-0.64px]",
                  isActive || isCompleted ? "text-black" : "text-nova-gray-700",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-px min-w-8 flex-1",
                  index < currentStep ? "bg-primary" : "bg-nova-gray-300",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export { DsStepper, type DsStepperProps, type DsStepperStep };
