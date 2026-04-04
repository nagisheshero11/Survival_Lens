import { apiRequest } from "@/services/api";
import type { ActivityProfile, ActivityRangeItem, ActivityToday } from "@/admin-services/types";

export function getProfile(userId: string): Promise<ActivityProfile> {
  return apiRequest<ActivityProfile>(`/api/admin/activity/profile/${userId}`);
}

export function getToday(userId: string): Promise<ActivityToday> {
  return apiRequest<ActivityToday>(`/api/admin/activity/today/${userId}`);
}

export function getRange(params: { userId: string; from: string; to: string }): Promise<ActivityRangeItem[]> {
  const query = new URLSearchParams(params).toString();
  return apiRequest<ActivityRangeItem[]>(`/api/admin/activity?${query}`);
}
