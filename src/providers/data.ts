import { appGamesDataProvider } from "./app/games";
import { appHomeDataProvider } from "./app/home";

export const dataProviders = {
  default: appHomeDataProvider,
  appHomeData: appHomeDataProvider,
  appGamesData: appGamesDataProvider,
}