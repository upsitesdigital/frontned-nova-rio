import { describe, it, expect } from "vitest";
import { Messages } from "./messages";

describe("Messages", () => {
  it("should have auth section with required keys", () => {
    expect(Messages.auth.sessionExpired).toBeDefined();
    expect(Messages.auth.fillAllFields).toBeDefined();
    expect(Messages.auth.invalidEmail).toBeDefined();
    expect(Messages.auth.wrongCredentials).toBeDefined();
    expect(Messages.auth.loginError).toBeDefined();
    expect(Messages.auth.pendingApproval).toBeDefined();
  });

  it("should have password section with required keys", () => {
    expect(Messages.password.mismatch).toBeDefined();
    expect(Messages.password.weak).toBeDefined();
    expect(Messages.password.changed).toBeDefined();
  });

  it("should have email section with required keys", () => {
    expect(Messages.email.requestError).toBeDefined();
    expect(Messages.email.verifyError).toBeDefined();
    expect(Messages.email.changed).toBeDefined();
  });

  it("should have profile section with required keys", () => {
    expect(Messages.profile.loadError).toBeDefined();
    expect(Messages.profile.saveError).toBeDefined();
    expect(Messages.profile.updated).toBeDefined();
    expect(Messages.profile.deleteError).toBeDefined();
  });

  it("should have cards section with required keys", () => {
    expect(Messages.cards.loadError).toBeDefined();
    expect(Messages.cards.addSuccess).toBeDefined();
    expect(Messages.cards.removeSuccess).toBeDefined();
    expect(Messages.cards.invalidNumber).toBeDefined();
    expect(Messages.cards.missingHolder).toBeDefined();
    expect(Messages.cards.invalidCvv).toBeDefined();
  });

  it("should have appointments section with required keys", () => {
    expect(Messages.appointments.selectDateTime).toBeDefined();
    expect(Messages.appointments.rescheduleSuccess).toBeDefined();
    expect(Messages.appointments.cancelSuccess).toBeDefined();
  });

  it("should have adminAppointments section with required keys", () => {
    expect(Messages.adminAppointments.loadError).toBeDefined();
    expect(Messages.adminAppointments.createSuccess).toBeDefined();
    expect(Messages.adminAppointments.requiredService).toBeDefined();
    expect(Messages.adminAppointments.requiredClient).toBeDefined();
    expect(Messages.adminAppointments.requiredDate).toBeDefined();
    expect(Messages.adminAppointments.requiredTime).toBeDefined();
  });

  it("should contain Portuguese strings", () => {
    expect(Messages.auth.sessionExpired).toContain("login");
    expect(Messages.profile.updated).toContain("sucesso");
    expect(Messages.cards.addSuccess).toContain("sucesso");
  });

  it("should have all expected top-level sections", () => {
    const sections = Object.keys(Messages);
    expect(sections).toContain("auth");
    expect(sections).toContain("password");
    expect(sections).toContain("email");
    expect(sections).toContain("profile");
    expect(sections).toContain("dashboard");
    expect(sections).toContain("scheduling");
    expect(sections).toContain("appointments");
    expect(sections).toContain("cards");
    expect(sections).toContain("payments");
    expect(sections).toContain("services");
    expect(sections).toContain("registration");
    expect(sections).toContain("adminAppointments");
  });
});
