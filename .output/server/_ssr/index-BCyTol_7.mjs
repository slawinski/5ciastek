import { j as jsxRuntimeExports, r as reactExports, R as React } from "../_libs/react.mjs";
import { B as Button } from "./router-CnAXmsJY.mjs";
import { I as InputField } from "./index-7Ht0-xz2.mjs";
import { g as generateSchedule } from "./schedule.utils-Bb6mMxWW.mjs";
import { P as PageLayout } from "./index-C0suNHnq.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import "./fermentation-Bau4Tr3q.mjs";
import "./hydration-CGlmKgls.mjs";
import { x as xstateReact_cjsExports } from "../_libs/xstate__react.mjs";
import { x as xstate_cjsExports } from "../_libs/xstate.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/lucide-react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream/promises";
import "node:https";
import "node:http2";
import "../_libs/zod.mjs";
import "../_libs/use-isomorphic-layout-effect.mjs";
import "../_libs/use-sync-external-store.mjs";
const bakeAlongMachine = xstate_cjsExports.createMachine({
  id: "bakeAlong",
  initial: "scheduling",
  context: {
    readyTime: null,
    doughTemp: null,
    hydration: null,
    levainRatio: null,
    ambientTemp: null,
    autolyseType: null,
    levainFlourType: null,
    schedule: null
  },
  states: {
    scheduling: {
      on: {
        UPDATE_SCHEDULE: {
          actions: xstate_cjsExports.assign({
            readyTime: ({ event }) => event.readyTime
          })
        },
        NEXT: {
          target: "dough",
          guard: ({ context }) => context.readyTime !== null
        }
      }
    },
    dough: {
      on: {
        UPDATE_DOUGH: {
          actions: xstate_cjsExports.assign({
            doughTemp: ({ event }) => event.doughTemp,
            hydration: ({ event }) => event.hydration,
            autolyseType: ({ event }) => event.autolyseType
          })
        },
        NEXT: {
          target: "starter",
          guard: ({ context }) => context.doughTemp !== null && context.hydration !== null && context.autolyseType !== null
        },
        BACK: "scheduling"
      }
    },
    starter: {
      on: {
        UPDATE_STARTER: {
          actions: xstate_cjsExports.assign({
            levainRatio: ({ event }) => event.levainRatio,
            ambientTemp: ({ event }) => event.ambientTemp,
            levainFlourType: ({ event }) => event.levainFlourType
          })
        },
        NEXT: {
          target: "generated",
          guard: ({ context }) => context.levainRatio !== null && context.ambientTemp !== null && context.levainFlourType !== null
        },
        BACK: "dough"
      }
    },
    generated: {
      entry: xstate_cjsExports.assign({
        schedule: ({ context }) => generateSchedule(context)
      }),
      on: {
        RESET: {
          target: "scheduling",
          actions: xstate_cjsExports.assign({
            readyTime: null,
            doughTemp: null,
            hydration: null,
            levainRatio: null,
            ambientTemp: null,
            autolyseType: null,
            levainFlourType: null,
            schedule: null
          })
        },
        BACK: "starter"
      }
    }
  }
});
const BakeAlongContext = reactExports.createContext(null);
const BakeAlongProvider = ({ children }) => {
  const [state, send] = xstateReact_cjsExports.useMachine(bakeAlongMachine);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BakeAlongContext.Provider, { value: { state, send }, children });
};
const useBakeAlong = () => {
  const context = reactExports.useContext(BakeAlongContext);
  if (!context) {
    throw new Error("useBakeAlong must be used within a BakeAlongProvider");
  }
  return context;
};
const stepTitle = "_stepTitle_1mutf_1";
const group = "_group_1mutf_13";
const label = "_label_1mutf_20";
const radioList = "_radioList_1mutf_28";
const radioOption = "_radioOption_1mutf_34";
const radioInput = "_radioInput_1mutf_44";
const styles$1 = {
  stepTitle,
  group,
  label,
  radioList,
  radioOption,
  radioInput
};
const formatDate$1 = (date) => {
  return date.toISOString().split("T")[0];
};
const formatTime$1 = (date) => {
  return date.toTimeString().split(" ")[0].substring(0, 5);
};
const StepSchedule = () => {
  const { state, send } = useBakeAlong();
  const { readyTime } = state.context;
  const tomorrow = /* @__PURE__ */ new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);
  const initialDate = readyTime ? formatDate$1(readyTime) : formatDate$1(tomorrow);
  const initialTime = readyTime ? formatTime$1(readyTime) : "09:00";
  const [dateStr, setDateStr] = reactExports.useState(initialDate);
  const [timeStr, setTimeStr] = reactExports.useState(initialTime);
  reactExports.useEffect(() => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const [hours, minutes] = timeStr.split(":").map(Number);
    const newReadyTime = new Date(year, month - 1, day, hours, minutes);
    if (newReadyTime.getTime() !== readyTime?.getTime()) {
      send({ type: "UPDATE_SCHEDULE", readyTime: newReadyTime });
    }
  }, [dateStr, timeStr, readyTime, send]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: styles$1.stepTitle, children: "When do you want your bread ready?" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.group, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        InputField,
        {
          label: "Bake Day",
          type: "date",
          id: "bake-day",
          name: "bake-day",
          value: dateStr,
          onChange: (e) => setDateStr(e.target.value)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        InputField,
        {
          label: "Ready Time",
          type: "time",
          id: "bake-time",
          name: "bake-time",
          value: timeStr,
          onChange: (e) => setTimeStr(e.target.value)
        }
      )
    ] })
  ] });
};
const StepDough = () => {
  const { state, send } = useBakeAlong();
  const { doughTemp, hydration, autolyseType } = state.context;
  const [localTemp, setLocalTemp] = reactExports.useState(doughTemp?.toString() ?? "23");
  const [localHydration, setLocalHydration] = reactExports.useState(hydration ?? 75);
  const [localAutolyseType, setLocalAutolyseType] = reactExports.useState(autolyseType ?? "autolyse");
  reactExports.useEffect(() => {
    const tempAsNumber = localTemp === "" ? null : parseFloat(localTemp);
    if (tempAsNumber !== doughTemp || localHydration !== hydration || localAutolyseType !== autolyseType) {
      send({
        type: "UPDATE_DOUGH",
        doughTemp: tempAsNumber,
        hydration: localHydration,
        autolyseType: localAutolyseType
      });
    }
  }, [localTemp, localHydration, localAutolyseType, doughTemp, hydration, autolyseType, send]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: styles$1.stepTitle, children: "Dough Parameters" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.group, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      InputField,
      {
        label: "Dough Temperature (°C)",
        type: "number",
        id: "dough-temp",
        name: "dough-temp",
        value: localTemp,
        onChange: (e) => setLocalTemp(e.target.value)
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.group, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.label, children: "Hydration" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.radioList, children: [75, 80].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles$1.radioOption, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "radio",
            name: "hydration",
            value: h,
            checked: localHydration === h,
            onChange: () => setLocalHydration(h),
            className: styles$1.radioInput
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          h,
          "%"
        ] })
      ] }, h)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.group, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.label, children: "Autolyse Type" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.radioList, children: ["autolyse", "fermentolyse"].map((type) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles$1.radioOption, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "radio",
            name: "autolyseType",
            value: type,
            checked: localAutolyseType === type,
            onChange: () => setLocalAutolyseType(type),
            className: styles$1.radioInput
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { textTransform: "capitalize" }, children: type })
      ] }, type)) })
    ] })
  ] });
};
const RATIOS = ["1:1:1", "1:2:2"];
const FLOUR_TYPES = ["Bread Flour", "Whole Wheat", "Rye"];
const StepStarter = () => {
  const { state, send } = useBakeAlong();
  const { levainRatio, ambientTemp, levainFlourType } = state.context;
  const [localRatio, setLocalRatio] = reactExports.useState(levainRatio ?? "1:2:2");
  const [localTemp, setLocalTemp] = reactExports.useState(ambientTemp?.toString() ?? "21");
  const [localFlourType, setLocalFlourType] = reactExports.useState(levainFlourType ?? "Bread Flour");
  reactExports.useEffect(() => {
    const tempAsNumber = localTemp === "" ? null : parseFloat(localTemp);
    if (localRatio !== levainRatio || tempAsNumber !== ambientTemp || localFlourType !== levainFlourType) {
      send({
        type: "UPDATE_STARTER",
        levainRatio: localRatio,
        ambientTemp: tempAsNumber,
        levainFlourType: localFlourType
      });
    }
  }, [localRatio, localTemp, localFlourType, levainRatio, ambientTemp, levainFlourType, send]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: styles$1.stepTitle, children: "Levain Preparation" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.group, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      InputField,
      {
        label: "Ambient Temperature (°C)",
        type: "number",
        id: "ambient-temp",
        name: "ambient-temp",
        value: localTemp,
        onChange: (e) => setLocalTemp(e.target.value)
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.group, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.label, children: "Feeding Ratio" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.radioList, children: RATIOS.map((ratio) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles$1.radioOption, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "radio",
            name: "levainRatio",
            value: ratio,
            checked: localRatio === ratio,
            onChange: () => setLocalRatio(ratio),
            className: styles$1.radioInput
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ratio })
      ] }, ratio)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles$1.group, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles$1.label, children: "Flour Type" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.radioList, children: FLOUR_TYPES.map((flourType) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: styles$1.radioOption, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "radio",
            name: "levainFlourType",
            value: flourType,
            checked: localFlourType === flourType,
            onChange: () => setLocalFlourType(flourType),
            className: styles$1.radioInput
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: flourType })
      ] }, flourType)) })
    ] })
  ] });
};
const pageContainer = "_pageContainer_ut59b_1";
const wizardCard = "_wizardCard_ut59b_5";
const wizardContentWrapper = "_wizardContentWrapper_ut59b_30";
const stepContainer = "_stepContainer_ut59b_44";
const summarySidebar = "_summarySidebar_ut59b_52";
const summaryTitle = "_summaryTitle_ut59b_70";
const summarySection = "_summarySection_ut59b_80";
const summaryLabel = "_summaryLabel_ut59b_86";
const summaryValue = "_summaryValue_ut59b_93";
const summaryStatus = "_summaryStatus_ut59b_99";
const statusDot = "_statusDot_ut59b_111";
const navigation = "_navigation_ut59b_117";
const navButton = "_navButton_ut59b_127";
const back = "_back_ut59b_131";
const reset = "_reset_ut59b_135";
const breadcrumbs = "_breadcrumbs_ut59b_140";
const crumb = "_crumb_ut59b_165";
const completedCrumb = "_completedCrumb_ut59b_180";
const activeCrumb = "_activeCrumb_ut59b_184";
const crumbSeparator = "_crumbSeparator_ut59b_190";
const calendarView = "_calendarView_ut59b_197";
const dateHeader = "_dateHeader_ut59b_206";
const timeSlot = "_timeSlot_ut59b_216";
const timeLabel = "_timeLabel_ut59b_228";
const phaseBlock = "_phaseBlock_ut59b_240";
const phaseBlockPrimary = "_phaseBlockPrimary_ut59b_252";
const phaseBlockSecondary = "_phaseBlockSecondary_ut59b_256";
const phaseLabel = "_phaseLabel_ut59b_260";
const phaseTime = "_phaseTime_ut59b_269";
const generatedHeader = "_generatedHeader_ut59b_284";
const styles = {
  pageContainer,
  wizardCard,
  wizardContentWrapper,
  stepContainer,
  summarySidebar,
  summaryTitle,
  summarySection,
  summaryLabel,
  summaryValue,
  summaryStatus,
  statusDot,
  navigation,
  navButton,
  back,
  reset,
  breadcrumbs,
  crumb,
  completedCrumb,
  activeCrumb,
  crumbSeparator,
  calendarView,
  dateHeader,
  timeSlot,
  timeLabel,
  phaseBlock,
  phaseBlockPrimary,
  phaseBlockSecondary,
  phaseLabel,
  phaseTime,
  generatedHeader
};
const formatTime = (date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
};
const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
};
const GeneratedSchedule = () => {
  const { state } = useBakeAlong();
  const schedule = state.context.schedule || [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.generatedSchedule, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: styles.generatedHeader, children: "Baking Timeline" }),
    schedule.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No schedule could be generated. Please check your inputs." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.calendarView, children: schedule.map((phase, index) => {
      const isFirstOfDate = index === 0 || formatDate(new Date(schedule[index - 1].start)) !== formatDate(new Date(phase.start));
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
        isFirstOfDate && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.dateHeader, children: formatDate(new Date(phase.start)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.timeSlot, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.timeLabel, children: formatTime(new Date(phase.start)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles.phaseBlock} ${index % 2 === 0 ? styles.phaseBlockPrimary : styles.phaseBlockSecondary}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.phaseLabel, children: phase.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles.phaseTime, children: [
              formatTime(new Date(phase.start)),
              " - ",
              formatTime(new Date(phase.end))
            ] })
          ] })
        ] })
      ] }, index);
    }) })
  ] });
};
const steps = [
  { id: "scheduling", name: "Schedule" },
  { id: "dough", name: "Dough" },
  { id: "starter", name: "Starter" },
  { id: "generated", name: "Generated" }
];
const WizardBreadcrumbs = () => {
  const { state } = useBakeAlong();
  const currentState = state.value;
  const currentStepIndex = steps.findIndex((step) => step.id === currentState);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: styles.breadcrumbs, children: steps.map((step, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `${styles.crumb} ${index === currentStepIndex ? styles.activeCrumb : ""} ${index < currentStepIndex ? styles.completedCrumb : ""}`,
        children: index + 1
      }
    ),
    index < steps.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.crumbSeparator })
  ] }, step.id)) });
};
const WizardSummary = () => {
  const { state } = useBakeAlong();
  const { context } = state;
  const formatDateTime = (date) => {
    if (!date) return "---";
    return date.toLocaleString("en-US", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.summarySidebar, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: styles.summaryTitle, children: "Batch Summary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.summarySection, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.summaryLabel, children: "Ready By" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.summaryValue, children: formatDateTime(context.readyTime) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.summarySection, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.summaryLabel, children: "Hydration" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.summaryValue, children: context.hydration ? `${context.hydration}%` : "---" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.summarySection, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.summaryLabel, children: "Dough Temp" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.summaryValue, children: context.doughTemp ? `${context.doughTemp}°C` : "---" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.summarySection, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.summaryLabel, children: "Starter Ratio" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.summaryValue, children: context.levainRatio || "---" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.summaryStatus, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.statusDot, style: {
        backgroundColor: context.readyTime && context.hydration && context.doughTemp ? "var(--color-green)" : "#ddd"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: state.value.toString().toUpperCase() })
    ] })
  ] });
};
const BakeAlongWizardContent = () => {
  const { state, send } = useBakeAlong();
  const renderStep = () => {
    if (state.matches("scheduling")) return /* @__PURE__ */ jsxRuntimeExports.jsx(StepSchedule, {});
    if (state.matches("dough")) return /* @__PURE__ */ jsxRuntimeExports.jsx(StepDough, {});
    if (state.matches("starter")) return /* @__PURE__ */ jsxRuntimeExports.jsx(StepStarter, {});
    if (state.matches("generated")) return /* @__PURE__ */ jsxRuntimeExports.jsx(GeneratedSchedule, {});
    return null;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLayout, { title: "Bake-a-long", containerClassName: styles.pageContainer, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.wizardCard, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(WizardBreadcrumbs, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.wizardContentWrapper, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.stepContainer, children: renderStep() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(WizardSummary, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.navigation, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: state.matches("dough") || state.matches("starter") || state.matches("generated") ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: `${styles.navButton} ${styles.back}`,
          onClick: () => send({ type: "BACK" }),
          children: "Back"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: " " }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        state.matches("scheduling") || state.matches("dough") || state.matches("starter") ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: styles.navButton,
            onClick: () => send({ type: "NEXT" }),
            children: state.matches("starter") ? "Generate Schedule" : "Next"
          }
        ) : null,
        state.matches("generated") && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: `${styles.navButton} ${styles.reset}`,
            onClick: () => send({ type: "RESET" }),
            children: "Start Over"
          }
        )
      ] })
    ] })
  ] }) });
};
const BakeAlongWizard = () => /* @__PURE__ */ jsxRuntimeExports.jsx(BakeAlongProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BakeAlongWizardContent, {}) });
const SplitComponent = BakeAlongWizard;
export {
  SplitComponent as component
};
