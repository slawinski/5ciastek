import { c as createServerRpc } from "./createServerRpc-wV0Vk4NU.mjs";
import { c as createServerFn } from "./index.mjs";
import { f as fermentationSchema } from "./fermentation-Bau4Tr3q.mjs";
import { e as expDecay, p as params } from "./schedule.utils-Bb6mMxWW.mjs";
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
const calculateFermentationTimesServer_createServerFn_handler = createServerRpc({
  id: "d29e2ad12d2e60ae1cb8265921632bf603160b46f91b262338f747ed96ad1a39",
  name: "calculateFermentationTimesServer",
  filename: "src/features/fermentation/calculateFermentationTimes.ts"
}, (opts) => calculateFermentationTimesServer.__executeServer(opts));
const calculateFermentationTimesServer = createServerFn().inputValidator((data) => fermentationSchema.parse(data)).handler(calculateFermentationTimesServer_createServerFn_handler, async ({
  data
}) => {
  const {
    temperature,
    hydration
  } = data;
  const adjustmentFactor = 75 / hydration;
  const bulkTime = expDecay(temperature, params.bulk_fermentation_time.a, params.bulk_fermentation_time.b, params.bulk_fermentation_time.c) * adjustmentFactor;
  const proofTime = expDecay(temperature, params.proofing_time.a, params.proofing_time.b, params.proofing_time.c) * adjustmentFactor;
  const totalTime = expDecay(temperature, params.total_fermentation_time.a, params.total_fermentation_time.b, params.total_fermentation_time.c) * adjustmentFactor;
  return {
    bulkTime,
    proofTime,
    totalTime
  };
});
export {
  calculateFermentationTimesServer_createServerFn_handler
};
