import Link from "next/link";
import { DsButton } from "@/design-system";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <DsButton asChild>
        <Link href="/login">Entrar</Link>
      </DsButton>
    </div>
  );
}
