import { describe, expect, it } from "vitest";

import { AddCardValidation, type AddCardFormInput } from "./add-card-schema";

const baseInput: AddCardFormInput = {
  cardNumber: "4111 1111 1111 1111",
  holderName: "Joao Silva",
  expiryMonth: "6",
  expiryYear: "2040",
  cvv: "123",
};

describe("AddCardValidation", () => {
  it("accepts a valid, non-expired card", () => {
    expect(AddCardValidation.validateForm(baseInput)).toEqual({});
  });

  it("rejects an expired card", () => {
    const errors = AddCardValidation.validateForm({
      ...baseInput,
      expiryMonth: "1",
      expiryYear: "2020",
    });
    expect(errors.expiryMonth).toBeDefined();
  });

  it("rejects an out-of-range month", () => {
    const errors = AddCardValidation.validateForm({ ...baseInput, expiryMonth: "13" });
    expect(errors.expiryMonth).toBeDefined();
  });
});
