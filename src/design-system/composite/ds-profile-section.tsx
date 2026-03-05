import { cn } from "@/lib/utils";

interface DsProfileField {
  label: string;
  value: string;
}

interface DsProfileSectionProps {
  title?: string;
  initials: string;
  fields: DsProfileField[];
  onEdit?: () => void;
  onChangeImage?: () => void;
  editLabel?: string;
  changeImageLabel?: string;
  className?: string;
}

function DsProfileSection({
  title = "Informações pessoais",
  initials,
  fields,
  onEdit,
  onChangeImage,
  editLabel = "Editar",
  changeImageLabel = "Alterar imagem",
  className,
}: DsProfileSectionProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-8 rounded-[20px] border border-nova-gray-100 bg-white p-6",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[20px] font-medium leading-[1.3] text-black">
          {title}
        </p>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="cursor-pointer text-base font-medium leading-[1.3] text-nova-gray-400 transition-colors hover:text-nova-gray-700"
          >
            {editLabel}
          </button>
        )}
      </div>

      {/* Avatar + Change Image */}
      <div className="flex items-center gap-6">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-nova-gray-300 bg-primary">
          <span className="text-[24px] font-medium leading-[1.3] tracking-[-0.96px] text-white">
            {initials}
          </span>
        </div>
        {onChangeImage && (
          <button
            type="button"
            onClick={onChangeImage}
            className="cursor-pointer rounded-[10px] bg-nova-gray-50 px-4 py-3 text-base font-medium leading-[1.3] text-nova-gray-700 transition-colors hover:bg-nova-gray-100"
          >
            {changeImageLabel}
          </button>
        )}
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-6">
        {fields.map((field) => (
          <div key={field.label} className="flex flex-col gap-1.5">
            <p className="text-[18px] font-medium leading-normal tracking-[-0.72px] text-nova-gray-700">
              {field.label}
            </p>
            <div className="flex items-center rounded-[6px] border border-nova-gray-200 px-4 py-3">
              <p
                className={cn(
                  "text-base leading-normal",
                  field.value && field.value !== "-"
                    ? "text-black"
                    : "text-nova-gray-400",
                )}
              >
                {field.value || "-"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { DsProfileSection, type DsProfileSectionProps, type DsProfileField };
