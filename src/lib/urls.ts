export const API_URL = import.meta.env.VITE_ENABLE_MSW !== "true"
    ? import.meta.env.VITE_API_URL
    : "";

// AUTH
const AUTH_API_URL = API_URL + "/auth";
export const LOGIN_API_URL = AUTH_API_URL + "/admin/login";
export const REFRESH_TOKEN_API_URL = AUTH_API_URL + "/refresh"
export const LOGOUT_API_URL = AUTH_API_URL + "/logout";
// export const GET_TOKEN_API_URL = AUTH_API_URL + "/me";