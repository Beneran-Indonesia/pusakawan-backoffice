import { appGamesDataProvider } from "./app/app-games-provider";
import { appHomeDataProvider } from "./app/app-home-provider";

export const dataProviders = {
  default: appHomeDataProvider,
  appHomeData: appHomeDataProvider,
  appGamesData: appGamesDataProvider,
}