class AdminRoleLabel {
  private static readonly labels: Record<string, string> = {
    ADMIN_MASTER: "Admin master",
    ADMIN_BASIC: "Admin básico",
  };

  static format(role: string): string {
    return AdminRoleLabel.labels[role] ?? role;
  }
}

export { AdminRoleLabel };
