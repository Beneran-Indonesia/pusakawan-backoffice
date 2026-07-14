import { appGamesDataProvider } from "./app/app-games-provider";
import { appHomeDataProvider } from "./app/app-home-provider";
import { editProfileDataProvider } from "./edit-profile-provider";

export const dataProviders = {
  default: appHomeDataProvider,
  appHomeData: appHomeDataProvider,
  appGamesData: appGamesDataProvider,
  editProfileData: editProfileDataProvider,
}