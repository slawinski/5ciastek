import { c as createServerRpc } from "./createServerRpc-D_-6bKnO.js";
import { c as createServerFn } from "../server.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "react";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
const BAKING_PRO_TIPS = [{
  title: "Watch the dough, not the clock",
  content: "Times are estimates. Focus on volume (should increase by 50-75% for bulk) and texture (should feel airy)."
}, {
  title: "Temperature is key",
  content: "Even a 1°C difference can shift fermentation by an hour or more. Use a probe thermometer for accuracy."
}, {
  title: "Hydration impact",
  content: "Higher hydration doughs typically ferment faster and produce a more open crumb, but are harder to handle."
}, {
  title: "The Poke Test",
  content: "Gently poke the dough. If it springs back slowly and leaves a slight indentation, it's ready to bake."
}, {
  title: "Steam is essential",
  content: "Steam during the first 15 minutes of baking keeps the crust soft, allowing for maximum oven spring."
}, {
  title: "Flour quality matters",
  content: "Higher protein content (12-13%) in bread flour provides better gluten structure for sourdough."
}, {
  title: "Autolyse for strength",
  content: "Mixing only flour and water for 30-60 minutes before adding salt and starter jumpstarts gluten development."
}, {
  title: "Gentle folding",
  content: "Use 'Stretch and Folds' instead of kneading to preserve the delicate air bubbles in sourdough."
}, {
  title: "Starter activity",
  content: "Always use your starter when it's at its peak (doubled or tripled in size) for the best lift."
}, {
  title: "Cold Proofing",
  content: "Proofing in the fridge for 12-24 hours develops deeper flavor and makes the dough easier to score."
}, {
  title: "Scoring depth",
  content: "Aim for a 0.5 to 1 cm deep cut at a slight angle (30-45 degrees) to encourage an 'ear' to form."
}, {
  title: "Preheat thoroughly",
  content: "Preheat your oven and Dutch oven for at least 45-60 minutes to ensure a stable, high heat."
}, {
  title: "Don't over-proof",
  content: "If the dough collapses when poked, it's over-proofed. Bake it immediately to minimize collapse."
}, {
  title: "Salt controls speed",
  content: "Salt doesn't just add flavor; it regulates fermentation by slowing down yeast activity."
}, {
  title: "The 'Windowpane' test",
  content: "Stretch a small piece of dough. If it becomes thin enough to see light through without breaking, gluten is well-developed."
}, {
  title: "Ambient vs. Dough Temp",
  content: "Dough temperature is more critical than room temperature. Aim for 24-26°C for consistent results."
}, {
  title: "Use a scale",
  content: "Weight is far more accurate than volume. 1 cup of flour can vary by 30 grams depending on how it's packed."
}, {
  title: "Keep your hands wet",
  content: "When handling high-hydration dough, wet hands prevent sticking much better than floured hands."
}, {
  title: "Clean your Dutch oven",
  content: "Burnt flour in the bottom of your pot can impart a bitter flavor to the bottom crust."
}, {
  title: "Let it cool fully",
  content: "Wait at least 2 hours before slicing. Sourdough continues to cook and set its structure while cooling."
}];
const getBakingTipsServer_createServerFn_handler = createServerRpc({
  id: "8a66c283cec61370593f35e394e9dbe00f40e08cf2a07747f4a5a7a629385485",
  name: "getBakingTipsServer",
  filename: "src/features/fermentation/getBakingTips.ts"
}, (opts) => getBakingTipsServer.__executeServer(opts));
const getBakingTipsServer = createServerFn().handler(getBakingTipsServer_createServerFn_handler, async () => {
  const now = /* @__PURE__ */ new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 864e5);
  const selected = [];
  const available = [...BAKING_PRO_TIPS];
  for (let i = 0; i < 3; i++) {
    const index = (dayOfYear + i) % available.length;
    selected.push(available[index]);
  }
  return selected;
});
export {
  getBakingTipsServer_createServerFn_handler
};
