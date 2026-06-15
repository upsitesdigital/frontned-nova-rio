import { SignOutClient } from "@/use-cases/auth/sign-out-client";

function signOutClient(): void {
  SignOutClient.execute();
}

export { signOutClient };
