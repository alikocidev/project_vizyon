import { iUpComingSeries } from "@/types/series.type";
import apiClient from "@/Services";

export const GetUpComingSeries = async (
    page?: number
): Promise<iUpComingSeries[]> => {
    try {
        const response = await apiClient.get("series/upcomings", {
            params: {
                page: page,
            },
        });
        const result: iUpComingSeries[] = response.data;
        return result;
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
};
