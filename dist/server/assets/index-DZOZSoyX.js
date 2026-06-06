import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useRef, useEffect, useState, useMemo, Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { P as PageLayout, l as layoutStyles } from "./index-C0suNHnq.js";
import { I as InputField } from "./index-7Ht0-xz2.js";
import { B as Button, f as fermentationQueryOptions, b as bakingTipsQueryOptions } from "./router-BRN3750v.js";
import { X } from "lucide-react";
import { f as fermentationSchema } from "./fermentation-Bau4Tr3q.js";
import { u as useDebounce } from "./useDebounce-HZYaHl8M.js";
import "@tanstack/react-router";
import "@tanstack/react-router-devtools";
import "@tanstack/react-devtools";
import "../server.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
import "./hydration-CGlmKgls.js";
import "zod";
const calculatorGrid = "_calculatorGrid_68lf5_1";
const cardHeader = "_cardHeader_68lf5_34";
const inputsWrapper = "_inputsWrapper_68lf5_44";
const radioSection = "_radioSection_68lf5_50";
const proTipsCard = "_proTipsCard_68lf5_56";
const proTipsTitle = "_proTipsTitle_68lf5_77";
const proTipsList = "_proTipsList_68lf5_87";
const skeletonItem = "_skeletonItem_68lf5_112";
const skeletonLine = "_skeletonLine_68lf5_122";
const skeletonLineShort = "_skeletonLineShort_68lf5_130";
const error = "_error_68lf5_151";
const label = "_label_68lf5_159";
const styles$3 = {
  calculatorGrid,
  cardHeader,
  inputsWrapper,
  radioSection,
  proTipsCard,
  proTipsTitle,
  proTipsList,
  skeletonItem,
  skeletonLine,
  skeletonLineShort,
  error,
  label,
  "radio-group": "_radio-group_68lf5_166",
  "radio-label": "_radio-label_68lf5_172",
  "radio-input": "_radio-input_68lf5_181"
};
function formatTime(time) {
  const hours = Math.floor(time);
  const minutes = Math.trunc(time * 60 % 60);
  return `${hours}h ${minutes}m`;
}
const styles$2 = {
  "modal-overlay": "_modal-overlay_1xw8i_1",
  "modal-content": "_modal-content_1xw8i_15",
  "modal-window-bar": "_modal-window-bar_1xw8i_28",
  "window-controls": "_window-controls_1xw8i_37",
  "close-button": "_close-button_1xw8i_42",
  "modal-content-body": "_modal-content-body_1xw8i_53"
};
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  const modalContentRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  return /* @__PURE__ */ jsx("div", { className: styles$2["modal-overlay"], children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: styles$2["modal-content"],
      ref: modalContentRef,
      children: [
        /* @__PURE__ */ jsx("div", { className: styles$2["modal-window-bar"], children: /* @__PURE__ */ jsx("div", { className: styles$2["window-controls"], children: /* @__PURE__ */ jsx(Button, { className: styles$2["close-button"], onClick: onClose, children: /* @__PURE__ */ jsx(X, {}) }) }) }),
        /* @__PURE__ */ jsx("div", { className: styles$2["modal-content-body"], children })
      ]
    }
  ) });
};
const styles$1 = {
  "modal-content-wrapper": "_modal-content-wrapper_zkf2z_1"
};
const LearnMoreModal = ({ isOpen, onClose }) => {
  return /* @__PURE__ */ jsx(Modal, { isOpen, onClose, children: /* @__PURE__ */ jsxs("div", { className: styles$1["modal-content-wrapper"], children: [
    /* @__PURE__ */ jsx("h2", { children: "Interpreting Fermentation Results" }),
    /* @__PURE__ */ jsx("p", { children: "This section provides guidance on how to understand and utilize the calculated bulk fermentation, proofing, and total fermentation times." }),
    /* @__PURE__ */ jsx("h3", { children: "Bulk Fermentation Time" }),
    /* @__PURE__ */ jsx("p", { children: "Bulk fermentation (or first rise) is the period after mixing where the dough develops flavor and strength. The calculated time is an estimate, and factors like flour type, starter activity, and specific recipe will influence the optimal duration. Look for signs like:" }),
    /* @__PURE__ */ jsxs("ul", { children: [
      /* @__PURE__ */ jsx("li", { children: "Increased volume (e.g., 20-50% rise depending on desired outcome)." }),
      /* @__PURE__ */ jsx("li", { children: "Dome-shaped top with rounded edges." }),
      /* @__PURE__ */ jsx("li", { children: "Some gas bubbles visible on the surface." }),
      /* @__PURE__ */ jsx("li", { children: "The dough should feel light and airy." })
    ] }),
    /* @__PURE__ */ jsx("p", { children: "**Adjustments:** If your kitchen is warmer than the input temperature, the actual bulk fermentation might be faster. If colder, it might be slower. Always prioritize the dough's feel and appearance over strict timing." }),
    /* @__PURE__ */ jsx("h3", { children: "Proofing Time" }),
    /* @__PURE__ */ jsx("p", { children: "Proofing (or final rise) is the last fermentation stage before baking. This is crucial for the final crumb structure and oven spring." }),
    /* @__PURE__ */ jsxs("ul", { children: [
      /* @__PURE__ */ jsx("li", { children: "The dough should appear noticeably larger and softer." }),
      /* @__PURE__ */ jsx("li", { children: `A "poke test" can be helpful: gently poke the dough with a floured finger. If it springs back slowly and leaves a slight indentation, it's likely ready. If it springs back quickly, it needs more time. If it doesn't spring back at all and feels deflated, it's overproofed.` }),
      /* @__PURE__ */ jsx("li", { children: "The calculated time provides a starting point, but visual and tactile cues are paramount." })
    ] }),
    /* @__PURE__ */ jsx("p", { children: "**Retarding (Cold Proofing):** Many recipes involve retarding the dough in the refrigerator. This significantly slows down fermentation, developing more complex flavors. The calculator's proofing time is for room-temperature proofing." }),
    /* @__PURE__ */ jsx("h3", { children: "Total Fermentation Time" }),
    /* @__PURE__ */ jsx("p", { children: "This is the sum of bulk fermentation and proofing times. It represents the estimated active fermentation duration at the given temperature and hydration. Remember that these are guidelines, and experienced bakers often rely on sensory evaluation (touch, smell, sight) to determine readiness." }),
    /* @__PURE__ */ jsx("p", { children: "Enjoy your baking!" })
  ] }) });
};
const container = "_container_wttgy_1";
const header = "_header_wttgy_8";
const title = "_title_wttgy_16";
const learnMoreBtn = "_learnMoreBtn_wttgy_24";
const mainResult = "_mainResult_wttgy_38";
const resultLabel = "_resultLabel_wttgy_52";
const mainValue = "_mainValue_wttgy_61";
const decimalValue = "_decimalValue_wttgy_69";
const secondaryResults = "_secondaryResults_wttgy_77";
const secondaryResult = "_secondaryResult_wttgy_77";
const secondaryValue = "_secondaryValue_wttgy_96";
const skeletonBox = "_skeletonBox_wttgy_117";
const skeletonText = "_skeletonText_wttgy_127";
const skeletonValue = "_skeletonValue_wttgy_135";
const skeletonValueSmall = "_skeletonValueSmall_wttgy_142";
const styles = {
  container,
  header,
  title,
  learnMoreBtn,
  mainResult,
  resultLabel,
  mainValue,
  decimalValue,
  secondaryResults,
  secondaryResult,
  secondaryValue,
  skeletonBox,
  skeletonText,
  skeletonValue,
  skeletonValueSmall
};
const ResultsPanel = ({ title: title2, results, onLearnMoreClick, isLoading = false }) => {
  return /* @__PURE__ */ jsxs("div", { className: styles.container, children: [
    /* @__PURE__ */ jsxs("div", { className: styles.header, children: [
      /* @__PURE__ */ jsx("h4", { className: styles.title, children: title2 }),
      /* @__PURE__ */ jsx(Button, { onClick: onLearnMoreClick, className: styles.learnMoreBtn, "aria-label": "Learn more about results", children: "?" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: styles.mainResult, children: isLoading ? /* @__PURE__ */ jsxs("div", { className: styles.skeletonBox, children: [
      /* @__PURE__ */ jsx("div", { className: styles.resultLabel, children: "Calculating..." }),
      /* @__PURE__ */ jsx("div", { className: styles.skeletonValue, style: { width: "60%", height: "3rem" } }),
      /* @__PURE__ */ jsx("div", { className: styles.skeletonText, style: { width: "40%" } })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: styles.resultLabel, children: "Bulk Fermentation" }),
      /* @__PURE__ */ jsx("div", { className: styles.mainValue, children: results.bulkFermentationTime || "--:--" }),
      /* @__PURE__ */ jsxs("div", { className: styles.decimalValue, children: [
        results.bulkFermentationTimeDecimal,
        " hours"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: styles.secondaryResults, children: [
      /* @__PURE__ */ jsx("div", { className: styles.secondaryResult, children: isLoading ? /* @__PURE__ */ jsxs("div", { className: styles.skeletonBox, style: { alignItems: "flex-start" }, children: [
        /* @__PURE__ */ jsx("div", { className: styles.resultLabel, children: "Proofing" }),
        /* @__PURE__ */ jsx("div", { className: styles.skeletonValueSmall })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: styles.resultLabel, children: "Proofing Time" }),
        /* @__PURE__ */ jsx("div", { className: styles.secondaryValue, children: results.proofingTime || "--:--" }),
        /* @__PURE__ */ jsxs("div", { className: styles.decimalValue, children: [
          results.proofingTimeDecimal,
          "h"
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: styles.secondaryResult, children: isLoading ? /* @__PURE__ */ jsxs("div", { className: styles.skeletonBox, style: { alignItems: "flex-start" }, children: [
        /* @__PURE__ */ jsx("div", { className: styles.resultLabel, children: "Total" }),
        /* @__PURE__ */ jsx("div", { className: styles.skeletonValueSmall })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: styles.resultLabel, children: "Total Time" }),
        /* @__PURE__ */ jsx("div", { className: styles.secondaryValue, children: results.totalFermentationTime || "--:--" }),
        /* @__PURE__ */ jsxs("div", { className: styles.decimalValue, children: [
          results.totalFermentationTimeDecimal,
          "h"
        ] })
      ] }) })
    ] })
  ] });
};
function BakingTipsList() {
  const {
    data: bakingTips = []
  } = useSuspenseQuery(bakingTipsQueryOptions);
  return /* @__PURE__ */ jsx("ul", { className: styles$3.proTipsList, children: bakingTips.map((tip, index) => /* @__PURE__ */ jsxs("li", { children: [
    /* @__PURE__ */ jsxs("strong", { children: [
      tip.title,
      ":"
    ] }),
    " ",
    tip.content
  ] }, index)) });
}
function BakingTipsSkeleton() {
  return /* @__PURE__ */ jsx("ul", { className: styles$3.proTipsList, children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxs("li", { className: styles$3.skeletonItem, children: [
    /* @__PURE__ */ jsx("div", { className: styles$3.skeletonLine, style: {
      width: "40%",
      marginBottom: "4px"
    } }),
    /* @__PURE__ */ jsx("div", { className: styles$3.skeletonLine }),
    /* @__PURE__ */ jsx("div", { className: `${styles$3.skeletonLine} ${styles$3.skeletonLineShort}` })
  ] }, i)) });
}
function FermentationResults({
  queryData,
  toggleModal
}) {
  const {
    data: fermentationResults
  } = useSuspenseQuery({
    ...fermentationQueryOptions(queryData || {
      temperature: 23,
      hydration: "75"
    })
  });
  const results = useMemo(() => {
    if (!fermentationResults) {
      return {
        bulkFermentationTime: "",
        proofingTime: "",
        totalFermentationTime: "",
        bulkFermentationTimeDecimal: 0,
        proofingTimeDecimal: 0,
        totalFermentationTimeDecimal: 0
      };
    }
    const {
      bulkTime,
      proofTime,
      totalTime
    } = fermentationResults;
    return {
      bulkFermentationTime: formatTime(bulkTime),
      proofingTime: proofTime ? formatTime(proofTime) : "",
      totalFermentationTime: formatTime(totalTime),
      bulkFermentationTimeDecimal: parseFloat(bulkTime.toFixed(2)),
      proofingTimeDecimal: proofTime ? parseFloat(proofTime.toFixed(2)) : 0,
      totalFermentationTimeDecimal: parseFloat(totalTime.toFixed(2))
    };
  }, [fermentationResults]);
  return /* @__PURE__ */ jsx(ResultsPanel, { title: "Results", results, onLearnMoreClick: toggleModal, isLoading: false });
}
function FermentationCalculator() {
  const [temperature, setTemperature] = useState("23");
  const debouncedTemperature = useDebounce(temperature, 500);
  const [hydration, setHydration] = useState(75);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState(null);
  const queryData = useMemo(() => {
    const parsedTemperature = debouncedTemperature === "" ? void 0 : parseFloat(debouncedTemperature);
    const validationResult = fermentationSchema.safeParse({
      temperature: parsedTemperature,
      hydration: String(hydration)
    });
    if (!validationResult.success) {
      setErrors(validationResult.error.flatten().fieldErrors);
      return null;
    }
    setErrors(null);
    return {
      temperature: parsedTemperature,
      hydration: String(hydration)
    };
  }, [debouncedTemperature, hydration]);
  const handleTemperatureChange = (e) => {
    setTemperature(e.target.value);
  };
  const handleHydrationChange = (e) => {
    setHydration(Number(e.target.value));
  };
  const toggleModal = () => setShowModal(!showModal);
  return /* @__PURE__ */ jsxs(PageLayout, { title: "Fermentation Calculator", children: [
    /* @__PURE__ */ jsxs("div", { className: styles$3.calculatorGrid, children: [
      /* @__PURE__ */ jsxs("div", { className: layoutStyles.card, children: [
        /* @__PURE__ */ jsx("h3", { className: styles$3.cardHeader, children: "Settings" }),
        /* @__PURE__ */ jsxs("div", { className: styles$3.inputsWrapper, children: [
          /* @__PURE__ */ jsx(InputField, { label: "Dough Temperature (°C)", value: temperature, onChange: handleTemperatureChange, type: "number", id: "temperature", name: "temperature" }),
          errors?.temperature && /* @__PURE__ */ jsx("p", { className: styles$3.error, children: errors.temperature[0] }),
          /* @__PURE__ */ jsxs("div", { className: styles$3.radioSection, children: [
            /* @__PURE__ */ jsx("label", { className: styles$3.label, children: "Hydration" }),
            /* @__PURE__ */ jsxs("div", { className: styles$3["radio-group"], children: [
              /* @__PURE__ */ jsxs("label", { className: styles$3["radio-label"], children: [
                /* @__PURE__ */ jsx("input", { type: "radio", value: "75", checked: hydration === 75, onChange: handleHydrationChange, className: styles$3["radio-input"] }),
                "75%"
              ] }),
              /* @__PURE__ */ jsxs("label", { className: styles$3["radio-label"], children: [
                /* @__PURE__ */ jsx("input", { type: "radio", value: "80", checked: hydration === 80, onChange: handleHydrationChange, className: styles$3["radio-input"] }),
                "80%"
              ] })
            ] }),
            errors?.hydration && /* @__PURE__ */ jsx("p", { className: styles$3.error, children: errors.hydration[0] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: layoutStyles.card, children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(ResultsPanel, { title: "Results", results: {
        bulkFermentationTime: "",
        proofingTime: "",
        totalFermentationTime: "",
        bulkFermentationTimeDecimal: 0,
        proofingTimeDecimal: 0,
        totalFermentationTimeDecimal: 0
      }, onLearnMoreClick: toggleModal, isLoading: true }), children: /* @__PURE__ */ jsx(FermentationResults, { queryData, toggleModal }) }) }),
      /* @__PURE__ */ jsxs("div", { className: `${layoutStyles.card} ${styles$3.proTipsCard}`, children: [
        /* @__PURE__ */ jsx("h4", { className: styles$3.proTipsTitle, children: "Baking Pro Tips" }),
        /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(BakingTipsSkeleton, {}), children: /* @__PURE__ */ jsx(BakingTipsList, {}) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(LearnMoreModal, { isOpen: showModal, onClose: toggleModal })
  ] });
}
export {
  FermentationCalculator as component
};
