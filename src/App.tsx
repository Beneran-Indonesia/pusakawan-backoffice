import { Refine, AuthProvider } from "@refinedev/core";
import { BrowserRouter, Route, Routes } from "react-router";
import routerProvider, {
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { dataProvider } from "./providers/data";
import { Login } from "./pages/login";
// import { ErrorComponent } from "./components/refine-ui/layout/error-component";
import { Layout } from "./components/refine-ui/layout/layout";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { useTranslation } from "react-i18next";
import type { I18nProvider } from "@refinedev/core";
import "./App.css";
import {
  LOGIN_API_URL,
  LOGOUT_API_URL,
  REFRESH_TOKEN_API_URL,
} from "./lib/urls";
import { UserContext, UserToken } from "./hooks/use-auth";
import { useState } from "react";

function App() {
  // I18N (INTERNATIONALIZATION / TRANSLATION)
  const { t, i18n } = useTranslation();

  const i18nProvider: I18nProvider = {
    translate: (key: string | string[], params: string) => {
      return t(key, params);
    },
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  // AUTH
  const [user, setUser] = useState<null | UserToken>(null);
  const authProvider: AuthProvider = {
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

      const data = await response.json();

      // Expect backend to return a JWT access token
      if (data?.accessToken) {
        // Persist token in memory
        setUser(data);

        return {
          success: true,
          redirectTo: "/home",
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
        // Notify backend to invalidate session / refresh token
        await fetch(LOGOUT_API_URL, { method: "POST", credentials: "include" });

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
        if (!user?.accessToken) {
          // Immediately refresh; if user clicks "rememberMe" -- automatic token rotation.
          // If not, throw error to log out.
          const response = await fetch(REFRESH_TOKEN_API_URL, {
            credentials: "include",
          });

          const user: UserToken = await response.json();
          if (user.accessToken) {
            setUser(user);
            return {
              authenticated: true,
            };
          }
          throw Error("No refresh token");
        }
        return {
          authenticated: false,
          error: new Error("No access token, forcing log out."),
          redirectTo: "/",
          logout: true,
        };
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
    getIdentity: async () => {
      if (user) {
        return user.user;
      }
      return null;
    },
  };

  // TITLE
  const websiteTitle = "Pusakawan Backoffice";
  const formattedWebsiteTitle = (route: string) => `${route} | ${websiteTitle}`;

  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return formattedWebsiteTitle(t("routes.sign_in"));
      case "/home":
        return "Home | Pusakawan Backoffice";
      default:
        return "Pusakawan Backoffice";
    }
  };

  return (
    <BrowserRouter>
      <ThemeProvider>
        <Refine
          dataProvider={dataProvider}
          notificationProvider={useNotificationProvider()}
          routerProvider={routerProvider}
          i18nProvider={i18nProvider}
          authProvider={authProvider}
          options={{
            title: {
              icon: (
                <img src="/logo.svg" alt="Pusakawan" style={{ height: 24 }} />
              ),
              text: websiteTitle,
            },
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
            projectId: "RTJIz6-9Uxngz-l6qX9H",
          }}
        >
          <UserContext.Provider value={user}>
            <Routes>
              <Route index element={<Login />} />
              <Route
                path="/home"
                element={
                  <Layout>
                    <div></div>
                  </Layout>
                }
              />
            </Routes>
            <Toaster />
            <UnsavedChangesNotifier />
          </UserContext.Provider>
          {/* for website's title */}
          <DocumentTitleHandler handler={getTitle} />
        </Refine>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
