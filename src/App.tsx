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
import { UserToken } from "@/types/users";
import { createAuthProvider } from "./providers/auth";
import { createResources, filterResources } from "./providers/resources";
import AppHome from "./pages/app/home";
import AppHomeNew from "./pages/app/home-new";
import AppGames from "./pages/app/games";
import AppGamesNew from "./pages/app/games-new";

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
      case "/home":
        return "Home | Pusakawan Backoffice";
      default:
        return "Pusakawan Backoffice";
    }
  };

  // MENU BAR AND ACCESS CONTROL
  const allResources = createResources(t);
  const resources = filterResources(allResources, user);

  const accessControlProvider: AccessControlProvider = {
    can: async ({ resource }) => {
      if (!user || !resource) {
        return { can: false };
      }

      const resourceDef = allResources.find((r) => r.list === resource);

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
                  <Navigate to={resources[0].list ?? "/"} replace />
                </Authenticated>
              }
            />
            {/* READ: home-app.md */}
            <Route
              path="/app/home"
              element={
                <Layout>
                  <AppHome />
                </Layout>
              }
            />

            <Route
              path="/app/home/new"
              element={
                <Layout>
                  <AppHomeNew />
                </Layout>
              }
            />

            <Route
              path="/app/games"
              element={
                <Layout>
                  <AppGames />
                </Layout>
              }
            />

            <Route
              path="/app/games/new"
              element={
                <Layout>
                  <AppGamesNew />
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
