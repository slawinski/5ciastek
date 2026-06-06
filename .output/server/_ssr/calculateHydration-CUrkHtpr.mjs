import { c as createServerRpc } from "./createServerRpc-wV0Vk4NU.mjs";
import { c as createServerFn } from "./index.mjs";
import { h as hydrationSchema } from "./hydration-CGlmKgls.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream";
import "node:stream/promises";
import "node:https";
import "node:http2";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/zod.mjs";
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
