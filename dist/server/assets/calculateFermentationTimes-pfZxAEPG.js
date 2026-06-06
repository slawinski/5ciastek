import { c as createServerRpc } from "./createServerRpc-D_-6bKnO.js";
import { c as createServerFn } from "../server.js";
import { f as fermentationSchema } from "./fermentation-Bau4Tr3q.js";
import { e as expDecay, p as params } from "./schedule.utils-Bb6mMxWW.js";
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
