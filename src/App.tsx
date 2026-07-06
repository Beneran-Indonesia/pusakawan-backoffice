import { Refine, AccessControlProvider, Authenticated } from "@refinedev/core";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import routerProvider, {
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { dataProviders } from "./providers/data";
import { Login } from "./pages/login";
// import { ErrorComponent } from "./components/refine-ui/layout/error-component";
import { Layout } from "./components/refine-ui/layout/layout";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { useTranslation } from "react-i18next";
import type { I18nProvider } from "@refinedev/core";
import "./App.css";
import { useMemo, useState } from "react";
import { UserToken } from "@/types/users-type";
import { createAuthProvider } from "./providers/auth-provider";
import { createResources, filterResources } from "./providers/resources";
import AppHome from "./pages/app/home";
import AppHomeNew from "./pages/app/home-new";
import AppGames from "./pages/app/games";
import AppGamesNew from "./pages/app/games-new";
import {
  APP_GAMES_NEW_ROUTE,
  APP_GAMES_ROUTE,
  APP_HOME_NEW_ROUTE,
  APP_HOME_ROUTE,
} from "./lib/urls";
import { UnderDevelopment } from "./components/refine-ui/layout/under-development";

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
  const authProvider = useMemo(() => createAuthProvider(user, setUser), [user]);

  // WEBSITE TITLE
  const websiteTitle = "Pusakawan Backoffice";
  const formattedWebsiteTitle = (route: string) => `${route} | ${websiteTitle}`;

  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return formattedWebsiteTitle(t("routes.sign_in"));
      case "/app/home":
        return formattedWebsiteTitle(t("routes.app_home"));
      case "/app/home/new":
        return formattedWebsiteTitle(t("routes.app_home_new"));
      case "/app/games":
        return formattedWebsiteTitle(t("routes.app_games"));
      case "/app/games/new":
        return formattedWebsiteTitle(t("routes.app_games_new"));
      default:
        return websiteTitle;
    }
  };

  // MENU BAR AND ACCESS CONTROL
  const allResources = createResources(t);
  const resources = filterResources(allResources, user);

  const accessControlProvider: AccessControlProvider = {
    can: async ({ resource, action }) => {
      if (!user || !resource) {
        return { can: false };
      }
      if (action !== "access") return { can: false };

      // find from the parent (APP | LMS)
      const resourceDef = allResources.find((r) => r?.meta?.parent === resource);

      return {
        can: resourceDef?.meta?.allowedRoles.includes(user.user.role) ?? false,
      };
    },
  };

  return (
    <BrowserRouter>
      <ThemeProvider>
        <Refine
          resources={resources}
          dataProvider={dataProviders}
          notificationProvider={useNotificationProvider()}
          routerProvider={routerProvider}
          i18nProvider={i18nProvider}
          authProvider={authProvider}
          accessControlProvider={accessControlProvider}
          options={{
            disableTelemetry: true,
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
            <Route
              index
              element={
                <Authenticated key="app" fallback={<Login />}>
                  <Navigate to={`${resources[0].list}`} replace />
                </Authenticated>
              }
            />

            <Route
              path={APP_HOME_ROUTE}
              element={
                <Layout>
                  <AppHome />
                </Layout>
              }
            />

            <Route
              path={APP_HOME_NEW_ROUTE}
              element={
                <Layout>
                  <AppHomeNew />
                </Layout>
              }
            />

            <Route
              path={APP_GAMES_ROUTE}
              element={
                <Layout>
                  <AppGames />
                </Layout>
              }
            />

            <Route
              path={APP_GAMES_NEW_ROUTE}
              element={
                <Layout>
                  <AppGamesNew />
                </Layout>
              }
            />
            {/* 404 error, only if authenticated */}
            <Route
              path="*"
              element={
                <Layout>
                  <UnderDevelopment title="Under Development" />
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
