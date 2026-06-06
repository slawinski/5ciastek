import { Link, createRootRouteWithContext, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { QueryClientProvider, queryOptions, QueryClient } from "@tanstack/react-query";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { useState, useRef, useEffect } from "react";
import { Menu, Croissant, X, Home, Droplets, Route as Route$6, ClipboardClock } from "lucide-react";
import { T as TSS_SERVER_FUNCTION, g as getServerFnById, c as createServerFn } from "../server.js";
import { f as fermentationSchema } from "./fermentation-Bau4Tr3q.js";
import { h as hydrationSchema } from "./hydration-CGlmKgls.js";
const button = "_button_8k5mv_1";
const styles$1 = {
  button
};
const Button = ({ children, className, ref, ...props }) => {
  const buttonClassName = `${styles$1.button} ${className || ""}`.trim();
  return /* @__PURE__ */ jsx("button", { className: buttonClassName, ref, ...props, children });
};
const header = "_header_102ce_1";
const title = "_title_102ce_19";
const sidebar = "_sidebar_102ce_48";
const nav = "_nav_102ce_141";
const navLink = "_navLink_102ce_148";
const styles = {
  header,
  title,
  "centered-link-content": "_centered-link-content_102ce_24",
  "icon-button": "_icon-button_102ce_33",
  sidebar,
  "sidebar-open": "_sidebar-open_102ce_63",
  "sidebar-header": "_sidebar-header_102ce_78",
  "desktop-title": "_desktop-title_102ce_99",
  "mobile-title": "_mobile-title_102ce_99",
  "sidebar-title": "_sidebar-title_102ce_109",
  nav,
  navLink
};
const SHOW_PROFILE_MENU = false;
function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const asideRef = useRef(null);
  const profileMenuRef = useRef(null);
  const sidebarClassName = `${styles.sidebar} ${isOpen ? styles["sidebar-open"] : ""}`;
  useEffect(() => {
    function handleClickOutside(event) {
      if (asideRef.current && !asideRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target) && isProfileMenuOpen) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("header", { className: styles.header, children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: () => setIsOpen(true),
          className: styles["icon-button"],
          "aria-label": "Open menu",
          children: /* @__PURE__ */ jsx(Menu, { size: 24 })
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: styles.title, children: /* @__PURE__ */ jsxs(Link, { to: "/", className: styles["centered-link-content"], children: [
        /* @__PURE__ */ jsx(Croissant, {}),
        " 5ciastek"
      ] }) }),
      SHOW_PROFILE_MENU
    ] }),
    /* @__PURE__ */ jsxs("aside", { ref: asideRef, className: sidebarClassName, children: [
      /* @__PURE__ */ jsxs("div", { className: styles["sidebar-header"], children: [
        /* @__PURE__ */ jsxs("h2", { className: styles["sidebar-title"], children: [
          /* @__PURE__ */ jsxs(Link, { to: "/", className: styles["desktop-title"], onClick: () => setIsOpen(false), children: [
            /* @__PURE__ */ jsx(Croissant, {}),
            " 5ciastek"
          ] }),
          /* @__PURE__ */ jsx("span", { className: styles["mobile-title"], children: "Navigation" })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            onClick: () => setIsOpen(false),
            className: styles["icon-button"],
            "aria-label": "Close menu",
            children: /* @__PURE__ */ jsx(X, { size: 24 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: styles.nav, children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/",
            onClick: () => setIsOpen(false),
            className: styles.navLink,
            children: [
              /* @__PURE__ */ jsx(Home, { size: 20 }),
              /* @__PURE__ */ jsx("span", { children: "Fermentation Calculator" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/hydration",
            onClick: () => setIsOpen(false),
            className: styles.navLink,
            children: [
              /* @__PURE__ */ jsx(Droplets, { size: 20 }),
              /* @__PURE__ */ jsx("span", { children: "Hydration Calculator" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/bake-a-long",
            onClick: () => setIsOpen(false),
            className: styles.navLink,
            children: [
              /* @__PURE__ */ jsx(Route$6, { size: 20 }),
              /* @__PURE__ */ jsx("span", { children: "Bake-A-Long" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/bake-history",
            onClick: () => setIsOpen(false),
            className: styles.navLink,
            children: [
              /* @__PURE__ */ jsx(ClipboardClock, { size: 20 }),
              /* @__PURE__ */ jsx("span", { children: "Bake History" })
            ]
          }
        )
      ] })
    ] })
  ] });
}
const appCss = "/assets/styles-bEKDrNw3.css";
const Route$5 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        title: "5ciastek - Sourdough Assistant"
      }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg"
      }
    ]
  }),
  shellComponent: RootDocument
});
function RootDocument({ children }) {
  const { queryClient } = Route$5.useRouteContext();
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsx("body", { className: "root-body", children: /* @__PURE__ */ jsxs(QueryClientProvider, { client: queryClient, children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("main", { className: "root-main", children }),
      /* @__PURE__ */ jsx(
        TanStackDevtools,
        {
          config: {
            position: "bottom-right"
          },
          plugins: [
            {
              name: "Tanstack Router",
              render: /* @__PURE__ */ jsx(TanStackRouterDevtoolsPanel, {})
            }
          ]
        }
      ),
      /* @__PURE__ */ jsx(Scripts, {})
    ] }) })
  ] });
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const calculateFermentationTimesServer = createServerFn().inputValidator((data) => fermentationSchema.parse(data)).handler(createSsrRpc("d29e2ad12d2e60ae1cb8265921632bf603160b46f91b262338f747ed96ad1a39"));
const fermentationQueryOptions = (data) => queryOptions({
  queryKey: ["fermentation", data],
  queryFn: () => calculateFermentationTimesServer({
    data
  }),
  staleTime: 1e3 * 60 * 60
  // Cache for 1 hour
});
const getBakingTipsServer = createServerFn().handler(createSsrRpc("8a66c283cec61370593f35e394e9dbe00f40e08cf2a07747f4a5a7a629385485"));
const bakingTipsQueryOptions = queryOptions({
  queryKey: ["bakingTips"],
  queryFn: () => getBakingTipsServer(),
  staleTime: Infinity
  // Keep tips stable during the session
});
const $$splitComponentImporter$4 = () => import("./index-DZOZSoyX.js");
const Route$4 = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component"),
  loader: async ({
    context: {
      queryClient
    }
  }) => {
    await Promise.all([queryClient.ensureQueryData(bakingTipsQueryOptions), queryClient.ensureQueryData(fermentationQueryOptions({
      temperature: 23,
      hydration: "75"
    }))]);
  }
});
const $$splitComponentImporter$3 = () => import("./index-Cd_Tu1mX.js");
const Route$3 = createFileRoute("/profile/")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const calculateHydrationServer = createServerFn().inputValidator((data) => hydrationSchema.parse(data)).handler(createSsrRpc("09d7491381d119c0b83b14c6dcae0ab4f794dfc9a9d9ccf43ca11fb0e7658d24"));
const hydrationQueryOptions = (data) => queryOptions({
  queryKey: ["hydration", data],
  queryFn: () => calculateHydrationServer({
    data
  }),
  staleTime: 1e3 * 60 * 60
  // Cache for 1 hour
});
const $$splitComponentImporter$2 = () => import("./index-CZS-w8CI.js");
const Route$2 = createFileRoute("/hydration/")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component"),
  loader: async ({
    context: {
      queryClient
    }
  }) => {
    await queryClient.ensureQueryData(hydrationQueryOptions({
      flourWeight: 500,
      desiredHydration: 70
    }));
  }
});
const $$splitComponentImporter$1 = () => import("./index-BRkYPz9n.js");
const Route$1 = createFileRoute("/bake-history/")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-Bxx-7RIJ.js");
const Route = createFileRoute("/bake-a-long/")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const IndexRoute = Route$4.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$5
});
const ProfileIndexRoute = Route$3.update({
  id: "/profile/",
  path: "/profile/",
  getParentRoute: () => Route$5
});
const HydrationIndexRoute = Route$2.update({
  id: "/hydration/",
  path: "/hydration/",
  getParentRoute: () => Route$5
});
const BakeHistoryIndexRoute = Route$1.update({
  id: "/bake-history/",
  path: "/bake-history/",
  getParentRoute: () => Route$5
});
const BakeALongIndexRoute = Route.update({
  id: "/bake-a-long/",
  path: "/bake-a-long/",
  getParentRoute: () => Route$5
});
const rootRouteChildren = {
  IndexRoute,
  BakeALongIndexRoute,
  BakeHistoryIndexRoute,
  HydrationIndexRoute,
  ProfileIndexRoute
};
const routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    context: {
      queryClient
    }
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Button as B,
  bakingTipsQueryOptions as b,
  fermentationQueryOptions as f,
  hydrationQueryOptions as h,
  router as r
};
