import { c as createServerRpc } from "./createServerRpc-D_-6bKnO.js";
import { c as createServerFn } from "../server.js";
import { h as hydrationSchema } from "./hydration-CGlmKgls.js";
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
import "zod";
const calculateHydration = (flourWeight, desiredHydration) => {
  const starterWeight = flourWeight * 0.2;
  const starterFlour = starterWeight / 2;
  const starterWater = starterWeight / 2;
  const totalFlour = flourWeight + starterFlour;
  const desiredTotalWater = totalFlour * (desiredHydration / 100);
  const waterToAdd = desiredTotalWater - starterWater;
  return {
    waterToAdd,
    starterWeight,
    starterFlour,
    starterWater,
    totalFlour,
    totalWater: desiredTotalWater
  };
};
const calculateHydrationServer_createServerFn_handler = createServerRpc({
  id: "09d7491381d119c0b83b14c6dcae0ab4f794dfc9a9d9ccf43ca11fb0e7658d24",
  name: "calculateHydrationServer",
  filename: "src/features/hydration/calculateHydration.ts"
}, (opts) => calculateHydrationServer.__executeServer(opts));
const calculateHydrationServer = createServerFn().inputValidator((data) => hydrationSchema.parse(data)).handler(calculateHydrationServer_createServerFn_handler, async ({
  data
}) => {
  const {
    flourWeight,
    desiredHydration
  } = data;
  return calculateHydration(flourWeight, desiredHydration);
});
export {
  calculateHydrationServer_createServerFn_handler
};
