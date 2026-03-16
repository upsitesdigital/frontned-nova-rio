import { vi, describe, it, expect, beforeEach } from "vitest";
import { triggerBlobDownload } from "./download-helpers";

describe("triggerBlobDownload", () => {
  const fakeUrl = "blob:http://localhost/fake-blob-url";
  let clickSpy: () => void;
  let linkElement: { href: string; download: string; click: () => void };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    clickSpy = vi.fn();
    linkElement = { href: "", download: "", click: clickSpy };

    vi.spyOn(document, "createElement").mockReturnValue(
      linkElement satisfies Pick<
        HTMLAnchorElement,
        "href" | "download" | "click"
      > as HTMLAnchorElement,
    );
    vi.spyOn(URL, "createObjectURL").mockReturnValue(fakeUrl);
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  });

  it("should create an object URL from the blob", () => {
    const blob = new Blob(["test"], { type: "text/plain" });

    triggerBlobDownload(blob, "file.txt");

    expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
  });

  it("should create an anchor element", () => {
    const blob = new Blob(["test"], { type: "text/plain" });

    triggerBlobDownload(blob, "file.txt");

    expect(document.createElement).toHaveBeenCalledWith("a");
  });

  it("should set the href to the blob URL", () => {
    const blob = new Blob(["test"], { type: "text/plain" });

    triggerBlobDownload(blob, "file.txt");

    expect(linkElement.href).toBe(fakeUrl);
  });

  it("should set the download attribute to the filename", () => {
    const blob = new Blob(["test"], { type: "text/plain" });

    triggerBlobDownload(blob, "report.pdf");

    expect(linkElement.download).toBe("report.pdf");
  });

  it("should click the link to trigger the download", () => {
    const blob = new Blob(["test"], { type: "text/plain" });

    triggerBlobDownload(blob, "file.txt");

    expect(clickSpy).toHaveBeenCalledOnce();
  });

  it("should revoke the object URL after 1 second", () => {
    const blob = new Blob(["test"], { type: "text/plain" });

    triggerBlobDownload(blob, "file.txt");
    expect(URL.revokeObjectURL).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);

    expect(URL.revokeObjectURL).toHaveBeenCalledWith(fakeUrl);
  });

  it("should not revoke the object URL before 1 second", () => {
    const blob = new Blob(["test"], { type: "text/plain" });

    triggerBlobDownload(blob, "file.txt");
    vi.advanceTimersByTime(999);

    expect(URL.revokeObjectURL).not.toHaveBeenCalled();
  });
});
