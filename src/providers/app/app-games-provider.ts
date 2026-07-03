import { APP_GAMES_API_URL } from "@/lib/urls";
import { createDataProvider } from "@refinedev/rest";
import { kyOptions } from "../ky-options";
export const { dataProvider: appGamesDataProvider } = createDataProvider(
  APP_GAMES_API_URL,
  {
    getList: {

    },
    getOne: {

    },
    update: {

    },
    deleteOne: {

    },
    create: {

    },
  },
  kyOptions
);