import { UpComingSeries } from "@/types/series.type";
import apiClient from "./api";

export const getUpComingSeries = async (
    page?: number
): Promise<UpComingSeries[]> => {
    try {
        const response = await apiClient.get("series/upcomings", {
            params: {
                page: page,
            },
        });
        const result: UpComingSeries[] = response.data;
        return result;
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
};
