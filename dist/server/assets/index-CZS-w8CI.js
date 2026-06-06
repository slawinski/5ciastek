import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { l as layoutStyles, P as PageLayout } from "./index-C0suNHnq.js";
import { useState, useMemo, Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { I as InputField } from "./index-7Ht0-xz2.js";
import { u as useDebounce } from "./useDebounce-HZYaHl8M.js";
import { h as hydrationSchema } from "./hydration-CGlmKgls.js";
import { h as hydrationQueryOptions } from "./router-BRN3750v.js";
import "zod";
import "@tanstack/react-router";
import "@tanstack/react-router-devtools";
import "@tanstack/react-devtools";
import "lucide-react";
import "../server.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "./fermentation-Bau4Tr3q.js";
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
  return /* @__PURE__ */ jsxs("div", { className: styles$1.container, children: [
    /* @__PURE__ */ jsx("div", { className: styles$1.header, children: /* @__PURE__ */ jsx("h4", { className: styles$1.title, children: title2 }) }),
    /* @__PURE__ */ jsx("div", { className: styles$1.mainResult, children: isLoading ? /* @__PURE__ */ jsxs("div", { className: styles$1.skeletonBox, children: [
      /* @__PURE__ */ jsx("div", { className: styles$1.resultLabel, children: "Calculating..." }),
      /* @__PURE__ */ jsx("div", { className: styles$1.skeletonValue, style: { width: "60%", height: "3rem" } })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: styles$1.resultLabel, children: "Water to Add" }),
      /* @__PURE__ */ jsx("div", { className: styles$1.mainValue, children: results ? `${results.waterToAdd.toFixed(0)}g` : "--" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: styles$1.secondaryResults, children: [
      /* @__PURE__ */ jsx("div", { className: styles$1.secondaryResult, children: isLoading ? /* @__PURE__ */ jsxs("div", { className: styles$1.skeletonBox, style: { alignItems: "flex-start" }, children: [
        /* @__PURE__ */ jsx("div", { className: styles$1.resultLabel, children: "Starter" }),
        /* @__PURE__ */ jsx("div", { className: styles$1.skeletonValueSmall })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: styles$1.resultLabel, children: "Starter Weight" }),
        /* @__PURE__ */ jsx("div", { className: styles$1.secondaryValue, children: results ? `${results.starterWeight.toFixed(0)}g` : "--" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: styles$1.secondaryResult, children: isLoading ? /* @__PURE__ */ jsxs("div", { className: styles$1.skeletonBox, style: { alignItems: "flex-start" }, children: [
        /* @__PURE__ */ jsx("div", { className: styles$1.resultLabel, children: "Total Flour" }),
        /* @__PURE__ */ jsx("div", { className: styles$1.skeletonValueSmall })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: styles$1.resultLabel, children: "Total Flour" }),
        /* @__PURE__ */ jsx("div", { className: styles$1.secondaryValue, children: results ? `${results.totalFlour.toFixed(0)}g` : "--" })
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
  return /* @__PURE__ */ jsx(
    ResultsPanel,
    {
      title: "Recipe Results",
      results: hydrationResults || null,
      isLoading: false
    }
  );
};
const HydrationCalculator = () => {
  const [flourWeight, setFlourWeight] = useState("500");
  const [desiredHydration, setDesiredHydration] = useState("70");
  const debouncedFlourWeight = useDebounce(flourWeight, 500);
  const debouncedDesiredHydration = useDebounce(desiredHydration, 500);
  const [errors, setErrors] = useState(null);
  const queryData = useMemo(() => {
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
  return /* @__PURE__ */ jsxs("div", { className: styles.calculatorGrid, children: [
    /* @__PURE__ */ jsxs("div", { className: layoutStyles.card, children: [
      /* @__PURE__ */ jsx("h3", { className: styles.cardHeader, children: "Dough Specs" }),
      /* @__PURE__ */ jsxs("div", { className: styles.inputsWrapper, children: [
        /* @__PURE__ */ jsx(
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
        errors?.flourWeight && /* @__PURE__ */ jsx("p", { className: styles.error, children: errors.flourWeight[0] }),
        /* @__PURE__ */ jsx(
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
        errors?.desiredHydration && /* @__PURE__ */ jsx("p", { className: styles.error, children: errors.desiredHydration[0] }),
        /* @__PURE__ */ jsx("div", { className: styles.infoBox, children: /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Starter:" }),
          " 20% of flour weight (1:1 ratio)"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: layoutStyles.card, children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(
      ResultsPanel,
      {
        title: "Recipe Results",
        results: null,
        isLoading: true
      }
    ), children: /* @__PURE__ */ jsx(HydrationResults, { queryData }) }) })
  ] });
};
function HydrationPage() {
  return /* @__PURE__ */ jsx(PageLayout, { title: "Hydration Calculator", children: /* @__PURE__ */ jsx(HydrationCalculator, {}) });
}
export {
  HydrationPage as component
};
