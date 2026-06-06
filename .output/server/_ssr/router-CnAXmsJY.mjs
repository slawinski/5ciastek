import { c as createRouter, a as createRootRouteWithContext, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent, L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider, q as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { c as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./index.mjs";
import { f as fermentationSchema } from "./fermentation-Bau4Tr3q.mjs";
import { h as hydrationSchema } from "./hydration-CGlmKgls.mjs";
import { M as Menu, C as Croissant, X, H as House, D as Droplets, R as Route$6, a as ClipboardClock } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream/promises";
import "node:https";
import "node:http2";
import "../_libs/zod.mjs";
const button = "_button_8k5mv_1";
const styles$1 = {
  button
};
const Button = ({ children, className, ref, ...props }) => {
  const buttonClassName = `${styles$1.button} ${className || ""}`.trim();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: buttonClassName, ref, ...props, children });
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
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = reactExports.useState(false);
  const asideRef = reactExports.useRef(null);
  const profileMenuRef = reactExports.useRef(null);
  const sidebarClassName = `${styles.sidebar} ${isOpen ? styles["sidebar-open"] : ""}`;
  reactExports.useEffect(() => {
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
  reactExports.useEffect(() => {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: styles.header, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => setIsOpen(true),
          className: styles["icon-button"],
          "aria-label": "Open menu",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { size: 24 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: styles.title, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: styles["centered-link-content"], children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Croissant, {}),
        " 5ciastek"
      ] }) }),
      SHOW_PROFILE_MENU
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { ref: asideRef, className: sidebarClassName, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles["sidebar-header"], children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: styles["sidebar-title"], children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: styles["desktop-title"], onClick: () => setIsOpen(false), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Croissant, {}),
            " 5ciastek"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles["mobile-title"], children: "Navigation" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => setIsOpen(false),
            className: styles["icon-button"],
            "aria-label": "Close menu",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: styles.nav, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/",
            onClick: () => setIsOpen(false),
            className: styles.navLink,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(House, { size: 20 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Fermentation Calculator" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/hydration",
            onClick: () => setIsOpen(false),
            className: styles.navLink,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Droplets, { size: 20 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Hydration Calculator" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/bake-a-long",
            onClick: () => setIsOpen(false),
            className: styles.navLink,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Route$6, { size: 20 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Bake-A-Long" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/bake-history",
            onClick: () => setIsOpen(false),
            className: styles.navLink,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardClock, { size: 20 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Bake History" })
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("body", { className: "root-body", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "root-main", children }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
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
const $$splitComponentImporter$4 = () => import("./index-DwaP27dj.mjs");
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
const $$splitComponentImporter$3 = () => import("./index-GJevFX9v.mjs");
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
const $$splitComponentImporter$2 = () => import("./index-B91Br6e8.mjs");
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
const $$splitComponentImporter$1 = () => import("./index-BRkYPz9n.mjs");
const Route$1 = createFileRoute("/bake-history/")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-BCyTol_7.mjs");
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
