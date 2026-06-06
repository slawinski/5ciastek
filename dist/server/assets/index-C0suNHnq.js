import { jsxs, jsx } from "react/jsx-runtime";
const dashboardContainer = "_dashboardContainer_16430_1";
const headerRow = "_headerRow_16430_20";
const pageTitle = "_pageTitle_16430_36";
const statsOverview = "_statsOverview_16430_52";
const content = "_content_16430_57";
const card = "_card_16430_65";
const layoutStyles = {
  dashboardContainer,
  headerRow,
  pageTitle,
  statsOverview,
  content,
  card
};
const PageLayout = ({
  title,
  stats,
  children,
  className,
  containerClassName
}) => {
  return /* @__PURE__ */ jsxs("div", { className: `${layoutStyles.dashboardContainer} ${containerClassName || ""}`, children: [
    /* @__PURE__ */ jsxs("div", { className: layoutStyles.headerRow, children: [
      /* @__PURE__ */ jsx("h2", { className: layoutStyles.pageTitle, children: title }),
      stats && /* @__PURE__ */ jsx("div", { className: layoutStyles.statsOverview, children: stats })
    ] }),
    /* @__PURE__ */ jsx("div", { className: className || layoutStyles.content, children })
  ] });
};
export {
  PageLayout as P,
  layoutStyles as l
};
