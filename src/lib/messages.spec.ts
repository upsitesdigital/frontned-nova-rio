import { describe, it, expect } from "vitest";
import { MESSAGES } from "./messages";

describe("MESSAGES", () => {
  it("should have auth section with required keys", () => {
    expect(MESSAGES.auth.sessionExpired).toBeDefined();
    expect(MESSAGES.auth.fillAllFields).toBeDefined();
    expect(MESSAGES.auth.invalidEmail).toBeDefined();
    expect(MESSAGES.auth.wrongCredentials).toBeDefined();
    expect(MESSAGES.auth.loginError).toBeDefined();
    expect(MESSAGES.auth.pendingApproval).toBeDefined();
  });

  it("should have password section with required keys", () => {
    expect(MESSAGES.password.mismatch).toBeDefined();
    expect(MESSAGES.password.weak).toBeDefined();
    expect(MESSAGES.password.changed).toBeDefined();
  });

  it("should have email section with required keys", () => {
    expect(MESSAGES.email.requestError).toBeDefined();
    expect(MESSAGES.email.verifyError).toBeDefined();
    expect(MESSAGES.email.changed).toBeDefined();
  });

  it("should have profile section with required keys", () => {
    expect(MESSAGES.profile.loadError).toBeDefined();
    expect(MESSAGES.profile.saveError).toBeDefined();
    expect(MESSAGES.profile.updated).toBeDefined();
    expect(MESSAGES.profile.deleteError).toBeDefined();
  });

  it("should have cards section with required keys", () => {
    expect(MESSAGES.cards.loadError).toBeDefined();
    expect(MESSAGES.cards.addSuccess).toBeDefined();
    expect(MESSAGES.cards.removeSuccess).toBeDefined();
    expect(MESSAGES.cards.invalidNumber).toBeDefined();
    expect(MESSAGES.cards.missingHolder).toBeDefined();
    expect(MESSAGES.cards.invalidCvv).toBeDefined();
  });

  it("should have appointments section with required keys", () => {
    expect(MESSAGES.appointments.selectDateTime).toBeDefined();
    expect(MESSAGES.appointments.rescheduleSuccess).toBeDefined();
    expect(MESSAGES.appointments.cancelSuccess).toBeDefined();
  });

  it("should have adminAppointments section with required keys", () => {
    expect(MESSAGES.adminAppointments.loadError).toBeDefined();
    expect(MESSAGES.adminAppointments.createSuccess).toBeDefined();
    expect(MESSAGES.adminAppointments.requiredService).toBeDefined();
    expect(MESSAGES.adminAppointments.requiredClient).toBeDefined();
    expect(MESSAGES.adminAppointments.requiredDate).toBeDefined();
    expect(MESSAGES.adminAppointments.requiredTime).toBeDefined();
  });

  it("should contain Portuguese strings", () => {
    expect(MESSAGES.auth.sessionExpired).toContain("login");
    expect(MESSAGES.profile.updated).toContain("sucesso");
    expect(MESSAGES.cards.addSuccess).toContain("sucesso");
  });

  it("should have all expected top-level sections", () => {
    const sections = Object.keys(MESSAGES);
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
