import { describe, it, expect } from "vitest";
import {
  buildEmployeeContacts,
  buildEmployeeStatus,
  buildEmployeeDetails,
  buildEmployeeActions,
} from "./employee-card-mappers";

describe("employee-card-mappers", () => {
  describe("buildEmployeeContacts", () => {
    it("should include CPF and email for all employees", () => {
      const contacts = buildEmployeeContacts("12345678901", null, "test@example.com");

      expect(contacts).toHaveLength(2);
      expect(contacts[0].value).toBe("123.456.789-01");
      expect(contacts[1].value).toBe("test@example.com");
    });

    it("should include phone when provided", () => {
      const contacts = buildEmployeeContacts("12345678901", "+5521999999999", "test@example.com");

      expect(contacts).toHaveLength(3);
      expect(contacts[1].value).toBe("(21) 99999-9999");
    });
  });

  describe("buildEmployeeStatus", () => {
    it("should return active status for ACTIVE", () => {
      const status = buildEmployeeStatus("ACTIVE");

      expect(status.label).toBe("Ativo");
      expect(status.variant).toBe("active");
    });

    it("should return inactive status for INACTIVE", () => {
      const status = buildEmployeeStatus("INACTIVE");

      expect(status.label).toBe("Inativo");
      expect(status.variant).toBe("inactive");
    });
  });

  describe("buildEmployeeDetails", () => {
    it("should show availability range when both values set", () => {
      const details = buildEmployeeDetails("08:00", "18:00");

      expect(details[0].label).toBe("Disponibilidade");
      expect(details[0].value).toBe("08:00 às 18:00");
    });

    it("should show 'Não definida' when from is null", () => {
      const details = buildEmployeeDetails(null, "18:00");

      expect(details[0].value).toBe("Não definida");
    });

    it("should show 'Não definida' when to is null", () => {
      const details = buildEmployeeDetails("08:00", null);

      expect(details[0].value).toBe("Não definida");
    });

    it("should show 'Não definida' when both are null", () => {
      const details = buildEmployeeDetails(null, null);

      expect(details[0].value).toBe("Não definida");
    });
  });

  describe("buildEmployeeActions", () => {
    it("should return schedule and edit actions", () => {
      const onSchedule = () => {};
      const onEdit = () => {};

      const actions = buildEmployeeActions(onSchedule, onEdit);

      expect(actions).toHaveLength(2);
      expect(actions[0].label).toBe("Agenda");
      expect(actions[0].onClick).toBe(onSchedule);
      expect(actions[1].label).toBe("Editar");
      expect(actions[1].onClick).toBe(onEdit);
    });
  });
});
