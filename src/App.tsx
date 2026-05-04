import { Refine, AuthProvider } from "@refinedev/core";

import { BrowserRouter, Route, Routes } from "react-router";
import routerProvider, {
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
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
  const { isLoading, user, logout, getIdTokenClaims } = useAuth0();

  if (isLoading) {
    return <span>loading...</span>;
  }

  const authProvider: AuthProvider = {
    login: async () => {
      return {
        success: true,
      };
    },
    logout: async () => {
      logout({ returnTo: window.location.origin });
      return {
        success: true,
      };
    },
    onError: async (error) => {
      console.error(error);
      return { error };
    },
    check: async () => {
      try {
        const token = await getIdTokenClaims();
        if (token) {
          axios.defaults.headers.common = {
            Authorization: `Bearer ${token.__raw}`,
          };
          return {
            authenticated: true,
          };
        } else {
          return {
            authenticated: false,
            error: {
              message: "Check failed",
              name: "Token not found",
            },
            redirectTo: "/login",
            logout: true,
          };
        }
      } catch (error: unknown) {
        return {
          authenticated: false,
          error: new Error(error as string),
          redirectTo: "/login",
          logout: true,
        };
      }
    },
    getPermissions: async () => null,
    getIdentity: async () => {
      if (user) {
        return {
          ...user,
          avatar: user.picture,
        };
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
          // eslint-disable-next-line react-hooks/rules-of-hooks
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
          {/* for website's title */}
          <DocumentTitleHandler handler={getTitle} />
        </Refine>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
