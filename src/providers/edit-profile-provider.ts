import { EDIT_PROFILE_API_URL } from "@/lib/urls";
import { createDataProvider } from "@refinedev/rest";
import { kyOptions } from "./ky-options";

export const { dataProvider: editProfileDataProvider } = createDataProvider(
    EDIT_PROFILE_API_URL,
    {
        getOne: {

            getEndpoint: () => "",
            mapResponse: async (response) => {
                const json = await response.clone().json();
                // Your API returns: { data: [...], total: 123 }
                // Refine needs: [...]
                return json.data;
            },
        },

        update: {
            getEndpoint: () => "",
            getRequestMethod: () => "put"
        }
    },
    kyOptions
)