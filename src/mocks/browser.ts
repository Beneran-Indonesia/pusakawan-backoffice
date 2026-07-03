import { setupWorker } from "msw/browser";
import { authHandlers } from "./handlers/auth";
import { appHomeHandlers } from "./handlers/app/app-home-mock";
import { appGamesHandlers } from "./handlers/app/app-games-mock";
// import { appGamesDetailsHandlers } from "./handlers/app/app-game-details-mock";

export const worker = setupWorker(
    ...authHandlers,
    ...appHomeHandlers,
    ...appGamesHandlers,
    // ...appGamesDetailsHandlers
);