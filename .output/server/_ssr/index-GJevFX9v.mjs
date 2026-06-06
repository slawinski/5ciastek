import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as Button } from "./router-CnAXmsJY.mjs";
import { P as PageLayout } from "./index-C0suNHnq.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import "./fermentation-Bau4Tr3q.mjs";
import "./hydration-CGlmKgls.mjs";
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
const profileHeader = "_profileHeader_1ftj2_1";
const avatarBox = "_avatarBox_1ftj2_21";
const userBasicInfo = "_userBasicInfo_1ftj2_35";
const userName = "_userName_1ftj2_39";
const userJoinDate = "_userJoinDate_1ftj2_45";
const editProfileBtn = "_editProfileBtn_1ftj2_53";
const profileGrid = "_profileGrid_1ftj2_59";
const profileCard = "_profileCard_1ftj2_77";
const cardTitle = "_cardTitle_1ftj2_84";
const statsList = "_statsList_1ftj2_94";
const prefList = "_prefList_1ftj2_94";
const statItem = "_statItem_1ftj2_100";
const prefItem = "_prefItem_1ftj2_100";
const statLabel = "_statLabel_1ftj2_107";
const statValue = "_statValue_1ftj2_114";
const prefToggle = "_prefToggle_1ftj2_119";
const achievementGrid = "_achievementGrid_1ftj2_128";
const badge = "_badge_1ftj2_134";
const styles = {
  profileHeader,
  avatarBox,
  userBasicInfo,
  userName,
  userJoinDate,
  editProfileBtn,
  profileGrid,
  profileCard,
  cardTitle,
  statsList,
  prefList,
  statItem,
  prefItem,
  statLabel,
  statValue,
  prefToggle,
  achievementGrid,
  badge
};
const ProfileDashboard = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageLayout, { title: "My Profile", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.profileHeader, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.avatarBox, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.avatarInitial, children: "B" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.userBasicInfo, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: styles.userName, children: "Baker Beta" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles.userJoinDate, children: "Joined Feb 2024 • Artisan Level" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: styles.editProfileBtn, children: "Edit Profile" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.profileGrid, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.profileCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: styles.cardTitle, children: "Baking Statistics" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.statsList, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.statItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statLabel, children: "Total Flour Used" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statValue, children: "12.5 kg" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.statItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statLabel, children: "Success Rate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statValue, children: "94%" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.statItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statLabel, children: "Favorite Hydration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.statValue, children: "75%" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.profileCard, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: styles.cardTitle, children: "App Preferences" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.prefList, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.prefItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Default Temperature Units" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.prefToggle, children: "°C" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.prefItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Compact Results View" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.prefToggle, children: "OFF" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.prefItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Email Notifications" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.prefToggle, children: "ON" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${styles.profileCard} ${styles.achievementsCard}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: styles.cardTitle, children: "Achievements" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.achievementGrid, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.badge, title: "First Bake", children: "🥖" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.badge, title: "Hydration King", children: "💧" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.badge, title: "Perfect Score", children: "★" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.badge, title: "Early Riser", children: "🌅" })
        ] })
      ] })
    ] })
  ] });
};
const SplitComponent = ProfileDashboard;
export {
  SplitComponent as component
};
