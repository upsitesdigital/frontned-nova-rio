import { SignOutAdmin } from "@/use-cases/auth/sign-out-admin";

function signOutAdmin(): void {
  SignOutAdmin.execute();
}

export { signOutAdmin };
