import { httpAuthDelete, httpAuthGet, httpAuthPatchWithBody, httpAuthPost } from "./http-client";

interface AdminHoliday {
  id: number;
  uuid: string;
  date: string;
  name: string;
  type: string;
  isBlocked: boolean;
}

interface SaveAdminHolidayPayload {
  date: string;
  name: string;
  isBlocked?: boolean;
}

interface SyncAdminHolidaysPayload {
  year: number;
}

interface SyncAdminHolidaysResponse {
  synced: number;
  holidays: Array<{
    date: string;
    name: string;
    type: string;
    isBlocked: boolean;
  }>;
}

async function fetchAdminHolidays(year?: number, signal?: AbortSignal): Promise<AdminHoliday[]> {
  const searchParams = new URLSearchParams();
  if (year) searchParams.set("year", String(year));

  const path = searchParams.size > 0 ? `/holidays?${searchParams.toString()}` : "/holidays";
  return httpAuthGet<AdminHoliday[]>(path, signal);
}

async function createAdminHoliday(payload: SaveAdminHolidayPayload): Promise<AdminHoliday> {
  return httpAuthPost<AdminHoliday>("/holidays", payload);
}

async function updateAdminHoliday(
  id: number,
  payload: Partial<SaveAdminHolidayPayload>,
): Promise<AdminHoliday> {
  return httpAuthPatchWithBody<AdminHoliday>(`/holidays/${id}`, payload);
}

async function deleteAdminHoliday(id: number): Promise<void> {
  await httpAuthDelete<void>(`/holidays/${id}`);
}

async function syncAdminHolidays(payload: SyncAdminHolidaysPayload): Promise<SyncAdminHolidaysResponse> {
  return httpAuthPost<SyncAdminHolidaysResponse>("/holidays/sync", payload);
}

export {
  fetchAdminHolidays,
  createAdminHoliday,
  updateAdminHoliday,
  deleteAdminHoliday,
  syncAdminHolidays,
  type AdminHoliday,
  type SaveAdminHolidayPayload,
  type SyncAdminHolidaysPayload,
  type SyncAdminHolidaysResponse,
};
