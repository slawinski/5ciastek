import { a as requireReact } from "./react.mjs";
import { r as requireUseIsomorphicLayoutEffect_cjs } from "./use-isomorphic-layout-effect.mjs";
import { r as requireXstate_cjs } from "./xstate.mjs";
import { r as requireWithSelector, a as requireShim } from "./use-sync-external-store.mjs";
var xstateReact_cjs = {};
var hasRequiredXstateReact_cjs;
function requireXstateReact_cjs() {
  if (hasRequiredXstateReact_cjs) return xstateReact_cjs;
  hasRequiredXstateReact_cjs = 1;
  Object.defineProperty(xstateReact_cjs, "__esModule", { value: true });
  var React = requireReact();
  var useIsomorphicLayoutEffect = requireUseIsomorphicLayoutEffect_cjs();
  var xstate = /* @__PURE__ */ requireXstate_cjs();
  var withSelector = requireWithSelector();
  var shim = requireShim();
  function _interopDefault(e) {
    return e && e.__esModule ? e : { "default": e };
  }
  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = /* @__PURE__ */ Object.create(null);
    if (e) {
      Object.keys(e).forEach(function(k) {
        if (k !== "default") {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function() {
              return e[k];
            }
          });
        }
      });
    }
    n["default"] = e;
    return Object.freeze(n);
  }
  var React__namespace = /* @__PURE__ */ _interopNamespace(React);
  var useIsomorphicLayoutEffect__default = /* @__PURE__ */ _interopDefault(useIsomorphicLayoutEffect);
  const forEachActor = (actorRef, callback) => {
    callback(actorRef);
    const children = actorRef.getSnapshot().children;
    if (children) {
      Object.values(children).forEach((child) => {
        forEachActor(child, callback);
      });
    }
  };
  function stopRootWithRehydration(actorRef) {
    const persistedSnapshots = [];
    forEachActor(actorRef, (ref) => {
      persistedSnapshots.push([ref, ref.getSnapshot()]);
      ref.observers = /* @__PURE__ */ new Set();
    });
    const systemSnapshot = actorRef.system.getSnapshot?.();
    actorRef.stop();
    actorRef.system._snapshot = systemSnapshot;
    persistedSnapshots.forEach(([ref, snapshot]) => {
      ref._processingStatus = 0;
      ref._snapshot = snapshot;
    });
  }
  function useIdleActorRef(logic, ...[options]) {
    let [[currentConfig, actorRef], setCurrent] = React.useState(() => {
      const actorRef2 = xstate.createActor(logic, options);
      return [logic.config, actorRef2];
    });
    if (logic.config !== currentConfig) {
      const newActorRef = xstate.createActor(logic, {
        ...options,
        snapshot: actorRef.getPersistedSnapshot({
          __unsafeAllowInlineActors: true
        })
      });
      setCurrent([logic.config, newActorRef]);
      actorRef = newActorRef;
    }
    useIsomorphicLayoutEffect__default["default"](() => {
      actorRef.logic.implementations = logic.implementations;
    });
    return actorRef;
  }
  function useActorRef(machine, ...[options, observerOrListener]) {
    const actorRef = useIdleActorRef(machine, options);
    React.useEffect(() => {
      if (!observerOrListener) {
        return;
      }
      const sub = actorRef.subscribe(xstate.toObserver(observerOrListener));
      return () => {
        sub.unsubscribe();
      };
    }, [observerOrListener]);
    React.useEffect(() => {
      actorRef.start();
      return () => {
        stopRootWithRehydration(actorRef);
      };
    }, [actorRef]);
    return actorRef;
  }
  function defaultCompare(a, b) {
    return a === b;
  }
  function useSelector(actor, selector, compare = defaultCompare) {
    const subscribe = React.useCallback((handleStoreChange) => {
      if (!actor) {
        return () => {
        };
      }
      const {
        unsubscribe
      } = actor.subscribe({
        next: handleStoreChange,
        error: handleStoreChange
      });
      return unsubscribe;
    }, [actor]);
    const boundGetSnapshot = React.useCallback(() => {
      const snapshot = actor?.getSnapshot();
      if (snapshot && "status" in snapshot && snapshot.status === "error") {
        throw snapshot.error;
      }
      return snapshot;
    }, [actor]);
    const selectedSnapshot = withSelector.useSyncExternalStoreWithSelector(subscribe, boundGetSnapshot, boundGetSnapshot, selector, compare);
    return selectedSnapshot;
  }
  function createActorContext(actorLogic, actorOptions) {
    const ReactContext = /* @__PURE__ */ React__namespace.createContext(null);
    const OriginalProvider = ReactContext.Provider;
    function Provider({
      children,
      logic: providedLogic = actorLogic,
      machine,
      options: providedOptions
    }) {
      if (machine) {
        throw new Error(`The "machine" prop has been deprecated. Please use "logic" instead.`);
      }
      const actor = useActorRef(providedLogic, {
        ...actorOptions,
        ...providedOptions
      });
      return /* @__PURE__ */ React__namespace.createElement(OriginalProvider, {
        value: actor,
        children
      });
    }
    Provider.displayName = `ActorProvider`;
    function useContext() {
      const actor = React__namespace.useContext(ReactContext);
      if (!actor) {
        throw new Error(`You used a hook from "${Provider.displayName}" but it's not inside a <${Provider.displayName}> component.`);
      }
      return actor;
    }
    function useSelector$1(selector, compare) {
      const actor = useContext();
      return useSelector(actor, selector, compare);
    }
    return {
      Provider,
      useActorRef: useContext,
      useSelector: useSelector$1
    };
  }
  function is(x, y) {
    if (x === y) {
      return x !== 0 || y !== 0 || 1 / x === 1 / y;
    } else {
      return x !== x && y !== y;
    }
  }
  function shallowEqual(objA, objB) {
    if (is(objA, objB)) return true;
    if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
      return false;
    }
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;
    for (let i = 0; i < keysA.length; i++) {
      if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
        return false;
      }
    }
    return true;
  }
  function useActor(logic, ...[options]) {
    const actorRef = useIdleActorRef(logic, options);
    const getSnapshot = React.useCallback(() => {
      return actorRef.getSnapshot();
    }, [actorRef]);
    const subscribe = React.useCallback((handleStoreChange) => {
      const {
        unsubscribe
      } = actorRef.subscribe({
        next: handleStoreChange,
        error: handleStoreChange
      });
      return unsubscribe;
    }, [actorRef]);
    const actorSnapshot = shim.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
    const snapshotWithStatus = "status" in actorSnapshot ? actorSnapshot : void 0;
    if (snapshotWithStatus?.status === "error") {
      throw snapshotWithStatus.error;
    }
    React.useEffect(() => {
      actorRef.start();
      return () => {
        stopRootWithRehydration(actorRef);
      };
    }, [actorRef]);
    return [actorSnapshot, actorRef.send, actorRef];
  }
  function useMachine(machine, ...[options]) {
    return useActor(machine, options);
  }
  xstateReact_cjs.createActorContext = createActorContext;
  xstateReact_cjs.shallowEqual = shallowEqual;
  xstateReact_cjs.useActor = useActor;
  xstateReact_cjs.useActorRef = useActorRef;
  xstateReact_cjs.useMachine = useMachine;
  xstateReact_cjs.useSelector = useSelector;
  return xstateReact_cjs;
}
var xstateReact_cjsExports = /* @__PURE__ */ requireXstateReact_cjs();
export {
  xstateReact_cjsExports as x
};
