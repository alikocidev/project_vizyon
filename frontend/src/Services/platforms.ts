import { Platform, PlatformTypes } from "@/types/platform.type";
import apiClient from "./api";

export const getPlatformContent = async (
    platformName: PlatformTypes,
    cursor?: string
): Promise<Platform> => {
    try {
        const response = await apiClient.get(
            `platform/${platformName}/popular`,
            {
                params: { cursor },
            }
        );
        const result: Platform = response.data;
        return result;
    } catch (error) {
        console.error("Fetch error:", error);
        return {} as Platform;
    }
};
