import { HttpClient } from "@/api/core/http-client";

export type AdminNotificationEvent =
  | "NEW_CLIENT"
  | "NEW_APPOINTMENT"
  | "APPOINTMENT_CANCELLED"
  | "APPOINTMENT_RESCHEDULED"
  | "PAYMENT_RECEIVED"
  | "PAYMENT_CANCELLED"
  | "ACCOUNT_DELETED";

export interface AdminNotificationSetting {
  id: number;
  uuid: string;
  email: string;
  events: AdminNotificationEvent[];
  createdAt: string;
  updatedAt: string;
}

class AdminNotificationsApi {
  static async list(): Promise<AdminNotificationSetting[]> {
    return HttpClient.authGet<AdminNotificationSetting[]>("/admin-notifications");
  }

  static async create(
    email: string,
    events: AdminNotificationEvent[],
  ): Promise<AdminNotificationSetting> {
    return HttpClient.authPost<AdminNotificationSetting>("/admin-notifications", { email, events });
  }

  static async update(
    id: number,
    events: AdminNotificationEvent[],
  ): Promise<AdminNotificationSetting> {
    return HttpClient.authPatchWithBody<AdminNotificationSetting>(`/admin-notifications/${id}`, {
      events,
    });
  }

  static async remove(id: number): Promise<void> {
    await HttpClient.authDelete<void>(`/admin-notifications/${id}`);
  }
}

export { AdminNotificationsApi };
