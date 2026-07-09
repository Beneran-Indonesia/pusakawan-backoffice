export const API_URL = import.meta.env.VITE_ENABLE_MSW !== "true"
  ? import.meta.env.VITE_API_URL
  : "";

// --- APP ROUTES ---
export const APP_ROUTE = "/app";
// --- APP HOME ROUTES ---
export const APP_HOME_ROUTE = APP_ROUTE + "/home";
export const APP_HOME_NEW_ROUTE = APP_HOME_ROUTE + "/new";
export const APP_EDIT_EDIT_ROUTE = APP_HOME_ROUTE + "/edit/:id"
// --- APP GAMES ROUTES ---
export const APP_GAMES_ROUTE = APP_ROUTE + "/games";
export const APP_GAMES_NEW_ROUTE = APP_GAMES_ROUTE + "/new";
export const APP_GAMES_EDIT_ROUTE = APP_GAMES_ROUTE + "/edit/:id"
// --- APP PROGRAM ROUTES ---
export const APP_PROGRAM_ROUTE = APP_GAMES_ROUTE + "/program";

export const APP_API_URL = `${API_URL}${APP_ROUTE}`;
export const APP_HOME_API_URL = `${API_URL}${APP_HOME_ROUTE}`;
export const APP_GAMES_API_URL = `${API_URL}${APP_GAMES_ROUTE}`;

// --- AUTH ---
const AUTH_API_URL = `${API_URL}/auth`;
export const LOGIN_API_URL = `${AUTH_API_URL}/admin/login`;
export const REFRESH_TOKEN_API_URL = `${AUTH_API_URL}/refresh`;
export const LOGOUT_API_URL = `${AUTH_API_URL}/logout`;

// --- MANAGE USER ---
export const MANAGE_USER_ROUTE = "/manage-user";
export const MANAGE_USER_API_URL = `${API_URL}${MANAGE_USER_ROUTE}`;