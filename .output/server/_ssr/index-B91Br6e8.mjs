import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { P as PageLayout, l as layoutStyles } from "./index-C0suNHnq.mjs";
import { u as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { I as InputField } from "./index-7Ht0-xz2.mjs";
import { u as useDebounce } from "./useDebounce-HZYaHl8M.mjs";
import { h as hydrationSchema } from "./hydration-CGlmKgls.mjs";
import { h as hydrationQueryOptions } from "./router-CnAXmsJY.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import "./fermentation-Bau4Tr3q.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/zod.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/lucide-react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream/promises";
import "node:https";
import "node:http2";
const container = "_container_17zzy_1";
const header = "_header_17zzy_7";
const title = "_title_17zzy_14";
const mainResult = "_mainResult_17zzy_21";
const resultLabel = "_resultLabel_17zzy_35";
const mainValue = "_mainValue_17zzy_44";
const secondaryResults = "_secondaryResults_17zzy_51";
const secondaryResult = "_secondaryResult_17zzy_51";
const secondaryValue = "_secondaryValue_17zzy_64";
const skeletonBox = "_skeletonBox_17zzy_71";
const skeletonValue = "_skeletonValue_17zzy_78";
const skeletonValueSmall = "_skeletonValueSmall_17zzy_84";
const styles$1 = {
  container,
  header,
  title,
  mainResult,
  resultLabel,
  mainValue,
  secondaryResults,
  secondaryResult,
  secondaryValue,
  skeletonBox,
  skeletonValue,
  skeletonValueSmall
};
const ResultsPanel = ({ title: title2, results, isLoading = false }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.container, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.header, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: styles$1.title, children: title2 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.mainResult, children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.skeletonBox, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.resultLabel, children: "Calculating..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.skeletonValue, style: { width: "60%", height: "3rem" } })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.resultLabel, children: "Water to Add" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.mainValue, children: results ? `${results.waterToAdd.toFixed(0)}g` : "--" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.secondaryResults, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.secondaryResult, children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.skeletonBox, style: { alignItems: "flex-start" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.resultLabel, children: "Starter" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.skeletonValueSmall })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.resultLabel, children: "Starter Weight" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.secondaryValue, children: results ? `${results.starterWeight.toFixed(0)}g` : "--" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.secondaryResult, children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.skeletonBox, style: { alignItems: "flex-start" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.resultLabel, children: "Total Flour" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.skeletonValueSmall })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.resultLabel, children: "Total Flour" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.secondaryValue, children: results ? `${results.totalFlour.toFixed(0)}g` : "--" })
      ] }) })
    ] })
  ] });
};
const calculatorGrid = "_calculatorGrid_1336v_1";
const cardHeader = "_cardHeader_1336v_8";
const inputsWrapper = "_inputsWrapper_1336v_18";
const error = "_error_1336v_24";
const infoBox = "_infoBox_1336v_31";
const styles = {
  calculatorGrid,
  cardHeader,
  inputsWrapper,
  error,
  infoBox
};
const HydrationResults = ({ queryData }) => {
  const { data: hydrationResults } = useSuspenseQuery({
    ...hydrationQueryOptions(queryData || { flourWeight: 500, desiredHydration: 70 })
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ResultsPanel,
    {
      title: "Recipe Results",
      results: hydrationResults || null,
      isLoading: false
    }
  );
};
const HydrationCalculator = () => {
  const [flourWeight, setFlourWeight] = reactExports.useState("500");
  const [desiredHydration, setDesiredHydration] = reactExports.useState("70");
  const debouncedFlourWeight = useDebounce(flourWeight, 500);
  const debouncedDesiredHydration = useDebounce(desiredHydration, 500);
  const [errors, setErrors] = reactExports.useState(null);
  const queryData = reactExports.useMemo(() => {
    const fw = parseFloat(debouncedFlourWeight);
    const dh = parseFloat(debouncedDesiredHydration);
    const validationResult = hydrationSchema.safeParse({
      flourWeight: fw,
      desiredHydration: dh
    });
    if (!validationResult.success) {
      setErrors(validationResult.error.flatten().fieldErrors);
      return null;
    }
    setErrors(null);
    return { flourWeight: fw, desiredHydration: dh };
  }, [debouncedFlourWeight, debouncedDesiredHydration]);
  const handleFlourChange = (e) => {
    setFlourWeight(e.target.value);
  };
  const handleHydrationChange = (e) => {
    setDesiredHydration(e.target.value);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.calculatorGrid, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: layoutStyles.card, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: styles.cardHeader, children: "Dough Specs" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.inputsWrapper, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          InputField,
          {
            label: "Total Flour (excluding starter) (g)",
            value: flourWeight,
            onChange: handleFlourChange,
            type: "number",
            id: "flourWeight",
            name: "flourWeight"
          }
        ),
        errors?.flourWeight && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles.error, children: errors.flourWeight[0] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          InputField,
          {
            label: "Desired Hydration (%)",
            value: desiredHydration,
            onChange: handleHydrationChange,
            type: "number",
            id: "desiredHydration",
            name: "desiredHydration"
          }
        ),
        errors?.desiredHydration && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles.error, children: errors.desiredHydration[0] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.infoBox, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Starter:" }),
          " 20% of flour weight (1:1 ratio)"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: layoutStyles.card, children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ResultsPanel,
      {
        title: "Recipe Results",
        results: null,
        isLoading: true
      }
    ), children: /* @__PURE__ */ jsxRuntimeExports.jsx(HydrationResults, { queryData }) }) })
  ] });
};
function HydrationPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLayout, { title: "Hydration Calculator", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HydrationCalculator, {}) });
}
export {
  HydrationPage as component
};
