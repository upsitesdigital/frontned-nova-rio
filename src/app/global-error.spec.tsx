import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as Sentry from "@sentry/nextjs";

import GlobalError from "./global-error";

vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
}));

describe("GlobalError", () => {
  const captureException = vi.mocked(Sentry.captureException);

  beforeEach(() => {
    captureException.mockClear();
  });

  it("reports the error to Sentry and shows the fallback copy", () => {
    const error = new Error("root layout exploded");

    render(<GlobalError error={error} />, { container: document.documentElement });

    expect(captureException).toHaveBeenCalledWith(error);
    expect(screen.getByRole("heading", { name: "Algo deu errado" })).toBeDefined();
  });
});
