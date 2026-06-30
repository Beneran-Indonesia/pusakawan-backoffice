import {
  Refine,
  AuthProvider,
  AccessControlProvider,
  Authenticated,
} from "@refinedev/core";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
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
import type { I18nProvider, ResourceProps } from "@refinedev/core";
import "./App.css";
import {
  LOGIN_API_URL,
  LOGOUT_API_URL,
  REFRESH_TOKEN_API_URL,
} from "./lib/urls";
import { UserContext } from "./hooks/use-auth";
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Gamepad2,
  Trophy,
  ShoppingBag,
  Users,
} from "lucide-react";
import { UserToken } from "@/types/users";

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

      const { data } = await response.json();

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
        setUser(null);
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
    getIdentity: async () => {
      if (user) {
        return user.user;
      }
      return null;
    },
  };

  // MENU BAR AND ACCESS CONTROL
  const lmsNavItems = [
    {
      list: "/lms/programs",
      name: t("menu_bar.lms.programs"),
      create: "",
      edit: "",
      meta: {
        parent: "LMS",
        key: "programs",
        label: t("menu_bar.lms.programs"),
        icon: <BookOpen className="w-5 h-5" />,
        allowedRoles: ["SUPER_ADMIN", "ADMIN", "LMS"],
      },
    },
    {
      list: "/lms/products",
      name: t("menu_bar.lms.our_products"),
      create: "",
      edit: "",
      meta: {
        parent: "LMS",
        key: "products",
        label: t("menu_bar.lms.our_products"),
        icon: <ShoppingBag className="w-5 h-5" />,
        allowedRoles: ["SUPER_ADMIN"],
      },
    },
    {
      list: "/lms/challenge",
      name: t("menu_bar.lms.challenge"),
      create: "",
      edit: "",
      meta: {
        parent: "LMS",
        key: "challenge",
        label: t("menu_bar.lms.challenge"),
        icon: <Trophy className="w-5 h-5" />,
        allowedRoles: ["SUPER_ADMIN", "ADMIN", "LMS"],
      },
    },
  ];

  const appNavItems = [
    {
      list: "/app/games",
      name: t("menu_bar.app.games"),
      create: "",
      edit: "",
      meta: {
        parent: "APP",
        key: "games",
        label: t("menu_bar.app.games"),
        icon: <Gamepad2 className="w-5 h-5" />,
        allowedRoles: ["SUPER_ADMIN", "ADMIN", "APP"],
      },
    },
    {
      list: "/app/home",
      name: t("menu_bar.app.home"),
      create: "",
      edit: "",
      meta: {
        parent: "APP",
        key: "home",
        label: t("menu_bar.app.home"),
        icon: <LayoutDashboard className="w-5 h-5" />,
        allowedRoles: ["SUPER_ADMIN", "ADMIN", "APP"],
      },
    },
    {
      list: "/app/programs",
      name: t("menu_bar.app.programs"),
      create: "",
      edit: "",
      meta: {
        parent: "APP",
        key: "programs",
        label: t("menu_bar.app.programs"),
        icon: <BookOpen className="w-5 h-5" />,
        allowedRoles: ["SUPER_ADMIN", "ADMIN", "APP"],
      },
    },
  ];

  const manageUserNavItems = {
    list: "/manage-users",
    name: "Manage Users",
    create: "",
    edit: "",
    meta: {
      parent: "MANAGE_USERS",
      key: "manage-users",
      label: "Manage Users",
      icon: <Users className="w-5 h-5" />,
      allowedRoles: ["SUPER_ADMIN"],
    },
  };

  const resources: ResourceProps[] = [
    ...lmsNavItems,
    ...appNavItems,
    manageUserNavItems,
  ];

  const newResourcesfn = (resources: ResourceProps[]) => {
    if (!user) {
      return resources;
    }

    const newResources = resources.filter((r) =>
      r.meta!.allowedRoles.includes(user.user.role),
    );

    return newResources;
  };

  const newResources = newResourcesfn(resources);

  const accessControlProvider: AccessControlProvider = {
    can: async ({ resource }) => {
      if (!user) {
        return { can: false };
      }

      if (!resource) {
        return { can: false };
      }

      const resourceDef = resources.find((r) => r.list === resource);

      const allowedRoles = resourceDef?.meta?.allowedRoles ?? [];

      return {
        can: allowedRoles.includes(user.user.role),
      };
    },
  };

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

  return (
    <BrowserRouter>
      <ThemeProvider>
        <Refine
          dataProvider={dataProvider}
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
          resources={newResources}
        >
          <UserContext.Provider value={user}>
            <Routes>
              <Route
                index
                element={
                  <Authenticated key="app" fallback={<Login />}>
                    <Navigate to={newResources[0].list ?? "/"} replace />
                  </Authenticated>
                }
              />
              <Route
                path="/home"
                element={<Layout>{/* {children} */}</Layout>}
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
