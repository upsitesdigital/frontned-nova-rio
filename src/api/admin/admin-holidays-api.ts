import { HttpClient } from "@/api/core/http-client";

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

class AdminHolidaysApi {
  static async fetchAdminHolidays(year?: number, signal?: AbortSignal): Promise<AdminHoliday[]> {
    const searchParams = new URLSearchParams();
    if (year) searchParams.set("year", String(year));

    const path = searchParams.size > 0 ? `/holidays?${searchParams.toString()}` : "/holidays";
    return HttpClient.authGet<AdminHoliday[]>(path, signal);
  }

  static async createAdminHoliday(payload: SaveAdminHolidayPayload): Promise<AdminHoliday> {
    return HttpClient.authPost<AdminHoliday>("/holidays", payload);
  }

  static async updateAdminHoliday(
    id: number,
    payload: Partial<SaveAdminHolidayPayload>,
  ): Promise<AdminHoliday> {
    return HttpClient.authPatchWithBody<AdminHoliday>(`/holidays/${id}`, payload);
  }

  static async deleteAdminHoliday(id: number): Promise<void> {
    await HttpClient.authDelete<void>(`/holidays/${id}`);
  }

  static async syncAdminHolidays(
    payload: SyncAdminHolidaysPayload,
  ): Promise<SyncAdminHolidaysResponse> {
    return HttpClient.authPost<SyncAdminHolidaysResponse>("/holidays/sync", payload);
  }
}

export {
  AdminHolidaysApi,
  type AdminHoliday,
  type SaveAdminHolidayPayload,
  type SyncAdminHolidaysPayload,
  type SyncAdminHolidaysResponse,
};
