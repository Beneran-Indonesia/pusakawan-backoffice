import { APP_API_URL } from "@/lib/urls";
import { createDataProvider } from "@refinedev/rest";
import { kyOptions } from "../ky-options";
export const { dataProvider: appGamesDataProvider } = createDataProvider(
  APP_API_URL,
  {
    getList: {
      buildQueryParams: async ({ pagination, filters, sorters }) => {

        const query: Record<string, unknown> = {};
        // /games?page=1&total=10

        query.page = pagination?.currentPage ?? 1;
        query.size = pagination?.pageSize ?? 10;

        if (sorters?.length) {
          query.sort = sorters.map(({ field, order }) => ({
            [field]: order,
          }))
        }

        for (const filter of filters ?? []) {
          if (!("field" in filter)) continue;

          if (filter.operator === "eq") {
            query[filter.field] = filter.value;
          }
        }
        return query;
      },

      // 3. Extract the data array from API response
      mapResponse: async (response) => {
        const json = await response.clone().json();
        // Your API returns: { data: [...], total: 123 }
        // Refine needs: [...]
        return json.data;
      },

      // 4. Extract the total count for pagination
      getTotalCount: async (response) => {
        const json = await response.clone().json();
        // Your API returns: { data: [...], total: 123 }
        // Refine needs: 123
        return json.total;
      },

    },
    getOne: {
            

    },
    // PATCH / PUT METHOD
    update: {
      getEndpoint: ({ resource, id }) => {
        return `${resource}/${id}`
      }, // "posts/123"
      getRequestMethod: () => 'put'

      // buildBodyParams: {


      // },
      // mapResponse: {

      // },
      // transformError: {

      // }
    },
    // DELETE METHOD
    deleteOne: {

    },
    // POST METHOD
    create: {

    },
  },
  kyOptions
);