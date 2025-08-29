import apiClient from "@/Services";
import { iPlatform, PlatformTypes } from "@/types/platform.type";

export const GetPlatformContent = async (
    platformName: PlatformTypes,
    cursor?: string
): Promise<iPlatform> => {
    try {
        const response = await apiClient.get(
            `platform/${platformName}/popular`,
            {
                params: { cursor },
            }
        );
        const result: iPlatform = response.data;
        return result;
    } catch (error) {
        console.error("Fetch error:", error);
        return {} as iPlatform;
    }
};
