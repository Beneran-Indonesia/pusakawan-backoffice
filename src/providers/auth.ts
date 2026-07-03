import { AuthProvider } from "@refinedev/core";
import { UserToken } from "@/types/users";
import { LOGIN_API_URL, LOGOUT_API_URL, REFRESH_TOKEN_API_URL } from "@/lib/urls";

let currentUser: UserToken | null = null;

export const authStore = {
    getUser: () => currentUser,
};

const _setUser = (user: UserToken | null) => {
    currentUser = user;
};

export function createAuthProvider(
    user: UserToken | null,
    setUser: React.Dispatch<React.SetStateAction<UserToken | null>>
): AuthProvider {
    return {
        login: async ({ email, password, rememberMe }) => {
            const response = await fetch(LOGIN_API_URL, {
                method: "POST",
                credentials: rememberMe ? "include" : "omit",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, rememberMe }),
            });

            // Fail fast if backend rejects credentials or request fails
            if (!response.ok) {
                return {
                    success: false,
                    error: {
                        name: "LoginError",
                        message: "Invalid credentials",
                    },
                };
            }

            const { data } = await response.json();

            // Expect backend to return a JWT access token
            if (data?.accessToken) {
                // Persist token in memory
                setUser(data);
                _setUser(data);
                return {
                    success: true,
                    redirectTo: "/app/home",
                };
            }

            // Response succeeded but didn't include expected auth payload
            return {
                success: false,
                error: {
                    name: "LoginError",
                    message: "No token received",
                },
            };
        },

        logout: async () => {
            try {
                setUser(null);
                _setUser(null);
                // Notify backend to invalidate session / refresh token
                const response = await fetch(LOGOUT_API_URL, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        Authorization: `Bearer ${user?.accessToken}`,
                    },
                });

                if (!response.ok) {
                    return {
                        success: false,
                        error: {
                            name: "LogoutError",
                            message: "Invalid credentials",
                        },
                    };
                }

                return {
                    success: true,
                    redirectTo: "/",
                };
            } catch {
                return { success: false };
            }
        },

        onError: async (error) => {
            // Centralized auth-related error logging / handling hook
            console.error("Auth error:", error);
            return { error };
        },

        check: async () => {
            try {
                // Retrieve stored token in memory
                if (user?.accessToken) {
                    return { authenticated: true };
                }
                // If no token - we need to do token rotation
                // Immediately refresh; if user clicks "rememberMe" -- automatic token rotation.
                // If not, throw error to log out.
                const response = await fetch(REFRESH_TOKEN_API_URL, {
                    method: "POST",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Refresh failed");
                }

                const refreshedUser: UserToken = await response.json();
                if (refreshedUser.accessToken) {
                    _setUser(refreshedUser);
                    setUser(refreshedUser);
                    return {
                        authenticated: true,
                    };
                }
                throw Error("No refresh token");
            } catch (error: unknown) {
                // If token missing/invalid/expired → force logout flow
                return {
                    authenticated: false,
                    error: new Error(error as string),
                    redirectTo: "/",
                    logout: true,
                };
            }
        },
        getPermissions: async () => user?.user.role ?? null,
        getIdentity: async () => user ?? null,

    };
}