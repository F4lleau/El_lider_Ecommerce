import { apiClient } from "./api-client";
import type { ApiResponse } from "../types/api";
import type { SiteContent } from "../types/site-content";

export const siteContentService = {
  async getByKey(key: string) {
    const { data } = await apiClient.get<ApiResponse<SiteContent>>(
      `/site-content/${key}`
    );
    return data;
  },
};