import { APP_API_URL } from "@/lib/urls";
import { createDataProvider } from "@refinedev/rest";
import { kyOptions } from "../ky-options";

// appHomeDataProvider
export const { dataProvider: appHomeDataProvider } = createDataProvider(
  APP_API_URL,
  {
    getList: {
      // 2. Transform Refine's parameters into your API's query format
      buildQueryParams: async ({ pagination, filters, sorters }) => {
        const query: Record<string, unknown> = {};

        // Handle pagination
        // Refine provides: { currentPage: 1, pageSize: 10 }
        // API expects: ?page=1&size=10
        query.page = pagination?.currentPage ?? 1;
        query.size = pagination?.pageSize ?? 10;

        // Handle sorting
        // Refine provides: [{ field: "createdAt", order: "desc" }]
        // API expects: ?sort[createdAt]=title
        if (sorters?.length) {
          query.sort = sorters.map(({ field, order }) => ({
            [field]: order,
          }))
        }

        // Handle filters -- on get all list. Maybe will filter in frontend also (?)
        // Refine provides: [{ field, operator, value }]
        // Example API expects: ?status=PUBLISHED&title_like=react
        // In our application, the filters can only be field of: ALL, PUBLISHED, DRAFT
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
      // Get one
    },
    update: {
      // Update function after getOne
    },
    deleteOne: {
      // 
    },
    create: {
      // 
    },
  }, // Create Data Provider Options,
  kyOptions
);