import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PageLayout } from "./index-C0suNHnq.mjs";
const overviewBox = "_overviewBox_z5gwz_1";
const overviewLabel = "_overviewLabel_z5gwz_10";
const overviewValue = "_overviewValue_z5gwz_17";
const historyGrid = "_historyGrid_z5gwz_24";
const historyCard = "_historyCard_z5gwz_43";
const cardHeader = "_cardHeader_z5gwz_50";
const date = "_date_z5gwz_56";
const score = "_score_z5gwz_63";
const bakeName = "_bakeName_z5gwz_72";
const statsRow = "_statsRow_z5gwz_79";
const stat = "_stat_z5gwz_79";
const statLabel = "_statLabel_z5gwz_91";
const statValue = "_statValue_z5gwz_98";
const wipOverlay = "_wipOverlay_z5gwz_104";
const wipBanner = "_wipBanner_z5gwz_112";
const wipText = "_wipText_z5gwz_145";
const historyGridBlurred = "_historyGridBlurred_z5gwz_176";
const styles = {
  overviewBox,
  overviewLabel,
  overviewValue,
  historyGrid,
  historyCard,
  cardHeader,
  date,
  score,
  bakeName,
  statsRow,
  stat,
  statLabel,
  statValue,
  wipOverlay,
  wipBanner,
  wipText,
  historyGridBlurred
};
const BakeHistoryCard = ({ date: date2, name, score: score2, hydration, temp }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.historyCard, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.cardHeader, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.date, children: date2 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.score, children: [
        "★ ",
        score2,
        "/10"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: styles.bakeName, children: name }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.statsRow, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.stat, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statLabel, children: "Hydration" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.statValue, children: [
          hydration,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.stat, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statLabel, children: "Temp" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.statValue, children: [
          temp,
          "°C"
        ] })
      ] })
    ] })
  ] });
};
const MOCK_HISTORY = [
  { id: 1, date: "Mar 8, 2024", name: "Standard Sourdough", score: 8, hydration: 75, temp: 23 },
  { id: 2, date: "Mar 5, 2024", name: "High Hydration Test", score: 9, hydration: 80, temp: 24 },
  { id: 3, date: "Feb 28, 2024", name: "Whole Wheat Loaf", score: 7, hydration: 78, temp: 22 },
  { id: 4, date: "Feb 20, 2024", name: "Rye & Caraway", score: 10, hydration: 75, temp: 23 },
  { id: 5, date: "Feb 12, 2024", name: "Rustic Boule", score: 6, hydration: 72, temp: 21 },
  { id: 6, date: "Feb 5, 2024", name: "Overnight Cold Proof", score: 9, hydration: 75, temp: 22 }
];
const HistoryDashboard = () => {
  const stats = /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.overviewBox, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.overviewLabel, children: "Total Bakes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.overviewValue, children: "42" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.overviewBox, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.overviewLabel, children: "Avg Score" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.overviewValue, children: "8.2" })
    ] })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLayout, { title: "Bake History", stats, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.wipOverlay, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.wipBanner, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.wipText, children: "Work In Progress" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${styles.historyGrid} ${styles.historyGridBlurred}`, children: MOCK_HISTORY.map((bake) => /* @__PURE__ */ jsxRuntimeExports.jsx(BakeHistoryCard, { ...bake }, bake.id)) })
  ] }) });
};
function BakeHistory() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryDashboard, {});
}
export {
  BakeHistory as component
};
